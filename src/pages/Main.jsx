import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Container from "../common/Container";
import { useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import { useMutation } from "react-query";
import { useQuery } from "react-query";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/posts";

export default function Main() {
  const navigate = useNavigate();
  const queryClient = new useQueryClient();
  const user = useSelector((state) => state.authSlice.user);

  // react-query로 백엔드로부터 데이터 가져오기
  const { data, isLoading, isError, error } = useQuery(
    "posts",
    async () => {
      const response = await axios.get(`${API_BASE_URL}`);
      return response.data;
    },
    {
      // 데이터를 성공적으로 가져오면, 데이터 다시 가져와서 화면에 그려줘
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
      },
    }
  );

  // db.json에서 게시글 삭제 : 삭제할 id값을 받아 실행
  const deleteMutation = useMutation(async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  });

  const createBtnHandler = () => {
    if (user) {
      navigate("/create");
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  return (
    <>
      <Header />
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            padding: "12px",
          }}
        >
          <button
            onClick={createBtnHandler}
            style={{
              border: "none",
              padding: "8px",
              borderRadius: "6px",
              backgroundColor: "skyblue",
              color: "white",
              cursor: "pointer",
            }}
          >
            추가
          </button>
        </div>

        {/* --------- 데이터 로딩, 에러메시지 --------- */}
        {isLoading === true && <div>로딩중입니다.</div>}
        {isError === true && <div>{error.message}</div>}

        {data?.map((post) => (
          <div
            key={post.id}
            style={{
              backgroundColor: "#EEEEEE",
              height: "100px",
              borderRadius: "24px",
              marginBottom: "12px",
              display: "flex",
              padding: "12px 16px 12px 16px",
            }}
          >
            <div
              onClick={() => {
                navigate(`/detail/${post.id}`);
              }}
              style={{
                flex: 4,
                borderRight: "1px solid lightgrey",
                cursor: "pointer",
              }}
            >
              <h2>{post.title}</h2>
              <p
                style={{
                  width: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {post.content}
              </p>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                justifyContent: "space-around",
                gap: "12px",
              }}
            >
              <div> {post.author}</div>
              {/* 현재 사용자(user)가 존재하고, 
              동시에(&&) 현재 사용자(user)의 이메일이 
              게시물의 작성자(author)와 일치하는지를 확인한다. */}
              {/* 작성자일 경우에만 수정, 삭제 버튼 보여주기 */}
              {user && user === post.author ? (
                <div>
                  <button
                    onClick={() => {
                      navigate("/edit", { state: { data: post } });
                    }}
                    style={{
                      border: "none",
                      padding: "8px",
                      borderRadius: "6px",
                      backgroundColor: "orange",
                      color: "white",
                      cursor: "pointer",
                      marginRight: "6px",
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      const result = window.confirm("정말로 삭제할거냥?");
                      if (result) {
                        // 게시글 삭제 실행, 인자로 삭제할 게시글 id 전달
                        deleteMutation.mutate(post.id);
                      }
                    }}
                    style={{
                      border: "none",
                      padding: "8px",
                      borderRadius: "6px",
                      backgroundColor: "red",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}

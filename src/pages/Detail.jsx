import React from "react";
import Header from "../common/Header";
import Container from "../common/Container";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import { useMutation } from "react-query";
import { useQuery } from "react-query";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/posts";

export default function Detail() {
  const { id } = useParams();
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

  const selectedData = data.find((post) => post?.id === Number(id)) || "";
  const { title, content } = selectedData;

  // 수정 버튼
  const editBtnHandler = () => {
    navigate(`/edit`, { state: { data: selectedData } });
  };

  // 삭제 버튼
  const deleteBtnHandler = () => {
    const result = window.confirm("정말로 삭제할거냥?");
    if (result) {
      deleteMutation.mutate(id);
    }
    navigate("/");
  };

  return (
    <>
      <Header />
      <Container>
        {/* --------- 데이터 로딩, 에러메시지 --------- */}
        {isLoading === true && <div>로딩중입니다.</div>}
        {isError === true && <div>{error.message}</div>}
        <h1
          style={{
            border: "1px solid lightgray",
            borderRadius: "12px",
            padding: "12px",
          }}
        >
          {title}
        </h1>
        <div
          style={{
            height: "400px",
            border: "1px solid lightgray",
            borderRadius: "12px",
            padding: "12px",
          }}
        >
          {content}
        </div>
        {/* 작성자일 경우에만 수정, 삭제 버튼 보여주기 */}
        {user && user === selectedData.author ? (
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <button
              onClick={editBtnHandler}
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
              onClick={deleteBtnHandler}
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
      </Container>
    </>
  );
}

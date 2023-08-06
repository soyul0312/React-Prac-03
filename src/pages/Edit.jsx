import React, { Fragment, useState } from "react";
import Header from "../common/Header";
import Container from "../common/Container";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useMutation } from "react-query";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/posts";

export default function Edit() {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state); // 받아온 데이터 확인하기
  const queryClient = new useQueryClient();

  // 변경된 내용 한번에 상태 관리
  const [editInput, setEditInput] = useState({
    title: state?.data.title || "",
    content: state?.data.content || "",
  });

  // db.json에서 게시글 수정 : 수정한 내용을 인자로 받아 실행
  const editMutation = useMutation(
    async (editData) => {
      await axios.put(`${API_BASE_URL}/${state.data.id}`, editData);
    },
    {
      // 데이터를 성공적으로 가져오면, 데이터 다시 가져와서 화면에 그려줘
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
      },
    }
  );

  const editBtnHandler = (e) => {
    e.preventDefault();
    editMutation.mutate({
      title: editInput.title,
      content: editInput.content,
      author: state?.data.author, // 유지해야하는 기존 작성자 정보
    });
    navigate("/");
  };

  const onChangeHandler = (e) => {
    setEditInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Fragment>
      <Header />
      <Container>
        <form
          style={{
            height: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
          onSubmit={editBtnHandler}
        >
          <div>
            <input
              name="title"
              placeholder="제목"
              value={editInput.title}
              onChange={onChangeHandler}
              style={{
                width: "100%",
                height: "60px",
                fontSize: "18px",
                borderRadius: "12px",
                border: "1px solid lightgrey",
                padding: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div
            style={{
              height: "400px",
            }}
          >
            <textarea
              name="content"
              placeholder="내용"
              value={editInput.content}
              onChange={onChangeHandler}
              style={{
                resize: "none",
                height: "100%",
                width: "100%",
                fontSize: "18px",
                borderRadius: "12px",
                border: "1px solid lightgrey",
                padding: "12px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            style={{
              width: "100%",
              height: "40px",
              border: "none",
              color: "white",
              borderRadius: "12px",
              backgroundColor: "orange",
              cursor: "pointer",
            }}
          >
            수정하기
          </button>
        </form>
      </Container>
    </Fragment>
  );
}

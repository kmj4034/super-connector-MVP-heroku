import React, { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { base_url, getQuestionsFromSelector } from "../atoms";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  padding: 8%;
`;
const Question = styled.div`
  margin-bottom: 8vh;
`;
const QuestionBox = styled.div`
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  padding: 4vw 7vw;
  position: relative;
  margin-bottom: 3vh;
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 10px;
    color: rgba(153, 153, 153, 1);
  }
  h3 {
    position: absolute;
    right: 5%;
    bottom: 15%;
    font-weight: bold;
  }
`;
const BtnGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Button = styled.button`
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background-color: #f5f5f5;
  border: 0;
  padding: 5%;
  margin-right: 10%;
  width: 100%;
  font-size: 1.2rem;
  :last-child {
    margin-right: 0;
  }
`;

function QuestionFromMe() {
  const navigate = useNavigate();

  const BASE_URL = useRecoilValue(base_url);

  // 질문 정보 조회
  const { user } = useOutletContext();
  const userId = user.id;
  const questions = useRecoilValue(getQuestionsFromSelector(userId)).data;

  // 질문 삭제
  const onClickDelete = async (questionId) => {
    await axios.delete(`${BASE_URL}/questions/delete/${questionId}`);
  };

  return (
    <Container>
      {questions.map((question) => (
        <Question key={question.id}>
          <QuestionBox>
            <h1>{question.title}</h1>
            <p>to {question.toAnswerer.nickname}</p>
            <p>
              {question.upvote} Like &nbsp;&nbsp;&nbsp;
              {question.createdAt.slice(0, 10)}
            </p>
            {/* 답변 완료 여부에 따라 구분 */}
            {!question.isAnswered ? <h3>답변 대기</h3> : <h3>답변 완료</h3>}
          </QuestionBox>
          <BtnGroup>
            <Button
              onClick={() => {
                onClickDelete(question.id);
                window.location.reload();
              }}
            >
              삭제
            </Button>
            <Button
              onClick={() => {
                navigate(
                  `/${question.toAnswererId}/modifyQuestion/${question.id}`
                );
              }}
            >
              수정하기
            </Button>
          </BtnGroup>
        </Question>
      ))}
    </Container>
  );
}

export default QuestionFromMe;

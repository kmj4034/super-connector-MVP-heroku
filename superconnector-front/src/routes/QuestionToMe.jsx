import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import {
  getQuestionsToSelector,
  base_url,
  getUserInfoSelector,
  getQuestionInfoSelector,
} from "../atoms";
import { useRecoilValue } from "recoil";
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

function QuestionToMe() {
  const { user } = useOutletContext(); // user = 로그인한 유저 정보
  const BASE_URL = useRecoilValue(base_url);
  // 질문 정보 조회
  const userId = user.id;
  const questions = useRecoilValue(getQuestionsToSelector(userId)).data;

  // 질문 삭제
  const onClickDelete = async (questionId) => {
    await axios.delete(`${BASE_URL}/questions/delete/${questionId}`);
    // 왜또 새로고침이 안되노..
  };

  // 답변하기로 이동
  const navigate = useNavigate();
  const onClickAnswer = (question) => {
    navigate(`/giveAnswer/${question.id}`, { state: { question } }); // 질문 정보를 state로 전달
  };

  // 답변 클릭 시 상세페이지로 이동
  const onClickDetail = (question) => {
    navigate(`/answer/${question.answers[0].id}`);
  };

  // 수정하기로 이동
  const onClickModify = (question) => {
    navigate(`/modifyAnswer/${question.id}`);
  };

  return (
    <Container>
      {questions.map((question) => (
        <Question key={question.id}>
          <QuestionBox
            onClick={() => {
              onClickDetail(question);
            }}
          >
            <h1>{question.title}</h1>
            <p>from {question.questioner.nickname}</p>
            <p>
              {question.upvote} Like &nbsp;&nbsp;&nbsp;
              {question.createdAt && question.createdAt.slice(0, 10)}
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
            {question.isAnswered ? (
              <Button
                onClick={() => {
                  onClickModify(question);
                }}
              >
                수정하기
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onClickAnswer(question);
                }}
              >
                답변하기
              </Button>
            )}
          </BtnGroup>
        </Question>
      ))}
    </Container>
  );
}

export default QuestionToMe;

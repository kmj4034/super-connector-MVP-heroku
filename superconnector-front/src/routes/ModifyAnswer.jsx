import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import styled from "styled-components";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { base_url, getQuestionInfoSelector } from "../atoms";

const Container = styled.div`
  padding: 8%;
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
    margin-top: 4vh;
    margin-bottom: 1vh;
  }
`;
const AnswerContainer = styled.form``;
const AnswerBox = styled.textarea`
  margin-bottom: 4vh;
  border: 1px solid black;
  padding: 3vw;
  width: 100%;
  height: 30vh;
  display: block;
  box-sizing: border-box;
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

function ModifyAnswer() {
  const BASE_URL = useRecoilValue(base_url);

  // 질문 정보 받아오기
  const params = useParams();
  const questionId = params.questionId;
  const question = useRecoilValue(getQuestionInfoSelector(questionId)).data;

  // 답변 보내기
  const [answerContent, setAnswerContent] = useState(
    question.answers[0].contentText
  );
  const onChangeAnswerContent = (e) => {
    setAnswerContent(e.target.value);
  };
  const onSubmitAnswer = async (e) => {
    await axios.patch(`${BASE_URL}/answers/modify/${question.answers[0].id}`, {
      contentText: answerContent,
    });
  };

  return (
    <>
      <Header />
      <Container>
        <QuestionBox>
          <h1>{question.title}</h1>
          <p>from {question.questioner.nickname}</p>
          <p>
            {question.upvote} Like &nbsp;&nbsp;&nbsp;
            {question.createdAt && question.createdAt.slice(0, 10)}
          </p>
          <h3>
            엘리베이터에서 갑자기 만났다. <br /> 질문을 한마디로 해야 한다면?
          </h3>
          <p>{question.title}</p>
          <h3>아 넵! 그러면 그 고민은 어떤 계기로 생겼나요?</h3>
          <p>{question.content1}</p>
          <h3>고민을 해결하기 위해 어떤 시도들을 해 보셨나요?</h3>
          <p>{question.content2}</p>
        </QuestionBox>
        <AnswerContainer onSubmit={onSubmitAnswer}>
          <AnswerBox
            onChange={onChangeAnswerContent}
            // value={answerContent}
            defaultValue={question.answers[0].contentText}
            placeholder="답변을 입력해 주세요"
          ></AnswerBox>
          <BtnGroup>
            <Button>취소</Button>
            <Button>보내기</Button>
          </BtnGroup>
        </AnswerContainer>
      </Container>
    </>
  );
}

export default ModifyAnswer;

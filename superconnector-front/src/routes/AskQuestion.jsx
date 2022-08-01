import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import { base_url, getUserInfoSelector } from "../atoms";
import { useRecoilValue } from "recoil";

const Container = styled.div`
  padding: 8%;
`;
const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 4vh;
`;
const Contents = styled.form``;
const QuestTitle = styled.h3`
  margin-bottom: 1vh;
`;
const QuestContents = styled.textarea`
  margin-bottom: 4vh;
  border: 1px solid black;
  padding: 10px;
  width: 100%;
  height: 20vh;
  display: block;
  box-sizing: border-box;
`;
const SubmitButton = styled.button`
  width: 100%;
  padding: 5%;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  margin: 5vh 0 8vh 0;
  border: 0;
`;

function AskQuestion() {
  const BASE_URL = useRecoilValue(base_url);
  const params = useParams();
  const userId = params.id;

  // const user = location.state.user;
  // user = 답변자 (toAnswererId) // 여기서 에러뜸. redirect됐을때 state가 존재하지 않기 때문. -> state로 받지 말고 api 하나 만들어서 useParams 이용해서 받아오자 recoil 써서 해보자
  // 차선책 : if (!location.state) {~~} 이렇게 조건문 달아서 부분적으로만 fetch하는 방식.

  const user = useRecoilValue(getUserInfoSelector(userId)).data;
  // console.log(user);

  // 질문 form 관련 state
  const [questInputs, setQuestInputs] = useState({
    title: "",
    content1: "",
    content2: "",
  });

  // 나중에 쓰기 편하게 비구조화 할당
  const { title, content1, content2 } = questInputs;

  const onChangeInputs = (e) => {
    const { name, value } = e.target;

    setQuestInputs({
      ...questInputs,
      [name]: value,
    });
  };

  // 질문 전송
  axios.defaults.withCredentials = true; // cors 방지

  const navigate = useNavigate();
  const onSubmit = async () => {
    await axios.post(`${BASE_URL}/questions/register/${user.id}`, {
      title: title,
      content1: content1,
      content2: content2,
    });
    // redirect하는 기능 추가해야 함
  };

  return (
    <>
      <Header />
      <Container>
        <Title>{user.nickname} 님에게 질문 남기기</Title>
        <Contents onSubmit={onSubmit}>
          <QuestTitle>
            엘레베이터에서 갑자기 만났다.
            <br />
            질문을 한마디로 해야한다면?
          </QuestTitle>
          <QuestContents
            name="title"
            placeholder="계기를 입력해주세요"
            onChange={onChangeInputs}
          ></QuestContents>
          <QuestTitle>아 넵! 그러면 그 고민은 어떤 계기로 생겼나요?</QuestTitle>
          <QuestContents
            name="content1"
            placeholder="계기를 입력해주세요"
            onChange={onChangeInputs}
          ></QuestContents>
          <QuestTitle>
            고민을 해결하기 위해 어떤 시도들을 해 보셨나요?
          </QuestTitle>
          <QuestContents
            name="content2"
            placeholder="계기를 입력해주세요"
            onChange={onChangeInputs}
          ></QuestContents>
          <SubmitButton>전송</SubmitButton>
        </Contents>
      </Container>
    </>
  );
}

export default AskQuestion;

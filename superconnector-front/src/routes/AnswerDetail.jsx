import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
  base_url,
  getAnswerInfoSelector,
  getQuestionsToSelector,
  userInfoSelector,
} from "../atoms";
import Header from "../components/Header";
import styled from "styled-components";
import { loginInfo, LoginState } from "../states/LoginState";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useState } from "react";
import { getLogInData } from "../utils/api";

const Container = styled.div`
  padding: 5vw;
`;

// Modal Styles
const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "30px",
    boxShadow: "2px 2px 15px rgba(0, 0, 0, 0.2)",
    border: "0",
    height: "60vh",
    width: "90vw",
  },
};
const ModalContent = styled.div`
  padding: 15% 0;
  font-size: 1.2rem;
`;
const Xmark = styled(FontAwesomeIcon)`
  position: absolute;
  top: 5%;
  right: 7%;
`;
const TextGroup = styled.div`
  width: 100%;
`;

const QuestionInfo = styled.div`
  padding: 3vw;
  h1 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 3vw;
  }
  p {
    margin-bottom: 10px;
    color: rgba(153, 153, 153, 1);
  }
`;

const LikeBtn = styled.button`
  color: rgba(104, 104, 104, 1);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  border: 0;
  background-color: #fff;
  display: flex;
  font-size: 1.2rem;
  padding: 1vw 3vw;
  height: min-content;
  margin-top: 3vw;
  margin-bottom: 3vw;
  p {
    margin-left: 2vw;
    margin-bottom: 0;
  }
`;

const AnswerContainer = styled.div``;
const AnswerBox = styled.div`
  margin-bottom: 4vh;
  border: 2px solid black;
  padding: 5vw;
  max-height: 80vw;
  display: block;
  box-sizing: border-box;
  overflow: auto;
`;
const AnswererProfile = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 20vw;
    height: 20vw;
    border-radius: 50%;
    display: block;
    margin-right: 3vw;
  }
  h2 {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 2vw;
  }
`;
const AnswerContent = styled.div`
  padding: 3vw;
  margin-top: 5vw;
  font-size: 1.1rem;
`;
const AnswerBtn = styled.button`
  background: #f5f5f5;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 0;
  padding: 5%;
  width: 100%;
  text-align: center;
  display: block;
  font-size: 1.1rem;
`;
const OtherQna = styled.div`
  margin-top: 20vw;
  h1 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 5vw;
  }
`;
const QnaBox = styled.div`
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  padding: 7vw 5vw;
  position: relative;
  margin-bottom: 3vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  p {
    color: rgba(153, 153, 153, 1);
  }
`;

function AnswerDetail() {
  const BASE_URL = useRecoilValue(base_url);

  // ????????? ?????? ??????
  const isLogged = useRecoilValue(LoginState);

  // ???????????? ?????? ?????? ??????  ->  ?????????????????? recoil, localStorage ???????????? ???????????? ?????????
  const loginData = useRecoilValue(loginInfo);

  // ?????? ?????? ?????? ??????
  const params = useParams();
  const answerId = params.answerId;
  const answer = useRecoilValue(getAnswerInfoSelector(answerId)).data;

  const { question, answerer } = answer; // ?????? ????????? ??????????????????

  const alertAuth = () => {
    alert("???????????? ???????????????.");
  };

  // upvote ?????? ?????? ???
  const onClickLike = async (questionId) => {
    if (!isLogged) {
      alertAuth();
    } else {
      await axios
        .patch(`${BASE_URL}/questions/upvote/${questionId}`, {
          userId: loginData.id,
        })
        .then((res) => {
          if (!res.data) {
            alert("?????? ?????????????????????.");
          } else {
            window.location.reload();
          }
        });
    }
  };

  // ??????????????? ??? ?????? ????????? ??????
  const otherQnas = useRecoilValue(getQuestionsToSelector(answerer.id)).data;

  // ?????? ?????? ?????????
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Qna ?????????
  const navigate = useNavigate();
  const onClickQna = (answerId) => {
    navigate(`/answer/${answerId}`);
    window.location.reload();
  };

  return (
    <>
      <Header />
      <Container>
        <QuestionInfo>
          <h1>{question.title}</h1>
          <p>from {question.questioner.nickname}???</p>
          <LikeBtn
            onClick={() => {
              onClickLike(question.id);
            }}
          >
            <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
            <p>{question.upvote}</p>
          </LikeBtn>
        </QuestionInfo>
        <AnswerContainer>
          <AnswerBox>
            <AnswererProfile>
              <img src={answerer.userPic} alt={answerer.nickname} />
              <div>
                <h2>{answerer.nickname}</h2>
                <p>
                  {answerer.job} | {answerer.company}
                </p>
              </div>
            </AnswererProfile>
            <AnswerContent>{answer.contentText}</AnswerContent>
          </AnswerBox>
          <AnswerBtn>?????? ?????? ?????????</AnswerBtn>
        </AnswerContainer>
        <OtherQna>
          <h1>{answerer.nickname}?????? ?????? Q&A</h1>
          {otherQnas.map((otherQna) => (
            <QnaBox key={otherQna.id}>
              <TextGroup
                onClick={() => {
                  otherQna.answers.length === 0
                    ? alert("????????? ????????????.")
                    : openModal();
                }}
              >
                <h2>{otherQna.title}</h2>
                <p>from {otherQna.questioner.nickname}</p>
              </TextGroup>
              <LikeBtn
                onClick={() => {
                  onClickLike(otherQna.id);
                }}
              >
                <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                <p>{otherQna.upvote}</p>
              </LikeBtn>
              {/* ?????? ?????? ????????? */}
              <Modal
                style={modalStyles}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
              >
                <ModalContent>
                  {otherQna.answers.map((answer) => (
                    <div
                      key={answer.id}
                      onClick={() => {
                        onClickQna(answer.id);
                      }}
                    >
                      <AnswerBox>
                        <p>{answer.id}</p>
                        <h1>{answer.answerer.nickname}?????? ??????</h1>
                        <p>
                          {answer.answerer.company} | {answer.answerer.job}
                        </p>
                      </AnswerBox>
                    </div>
                  ))}
                  <Xmark icon={faXmark} onClick={closeModal} />
                </ModalContent>
              </Modal>
            </QnaBox>
          ))}
        </OtherQna>
      </Container>
    </>
  );
}

export default AnswerDetail;

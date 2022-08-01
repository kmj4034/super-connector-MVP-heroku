import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { base_url, getQuestionInfoSelector, userInfoSelector } from "../atoms";
import Header from "../components/Header";
import { checkLoggedIn, loginInfo, LoginState } from "../states/LoginState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";

const Container = styled.div`
  padding: 8%;
`;
const Profile = styled.div`
  padding: 10% 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 10px 0;
  }
  p {
    margin-bottom: 10px;
  }
`;
const UserPic = styled.img`
  width: 20vw;
  height: 20vw;
  border-radius: 50%;
  display: block;
`;
const Button = styled(Link)`
  background: #f5f5f5;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 0;
  padding: 5%;
  width: 100%;
  text-align: center;
  display: block;
`;
const ButtonToLogin = styled.div`
  background: #f5f5f5;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 0;
  padding: 5%;
  width: 100%;
  text-align: center;
  display: block;
`;
const Questions = styled.ul`
  margin-bottom: 8vh;
`;
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 5vw 0;
`;
const QuestionBox = styled.li`
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  padding: 4vw 6vw;
  position: relative;
  margin-bottom: 7vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-weight: bold;
    margin-bottom: 10px;
  }
  p {
    color: rgba(153, 153, 153, 1);
  }
  h3 {
    position: absolute;
    right: 5%;
    bottom: 15%;
    font-weight: bold;
  }
`;
const TextGroup = styled.div`
  width: 100%;
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
  p {
    margin-left: 2vw;
  }
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
const ModalContent = styled.ul`
  padding: 15% 0;
  font-size: 1.2rem;
  text-align: center;
  button {
    margin: 10% 10% 0 0;
    :last-child {
      margin-right: 0;
    }
    border: 0;
    padding: 5% 8%;
    border-radius: 10px;
    font-size: 1.2rem;
  }
`;
const Xmark = styled(FontAwesomeIcon)`
  position: absolute;
  top: 5%;
  right: 7%;
`;
const AnswerBox = styled(QuestionBox)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6vw;
  p {
    font-size: 1rem;
  }
  h1 {
    font-size: 1.1rem;
    margin-bottom: 0;
  }
`;

function UserDetail() {
  axios.defaults.withCredentials = true;
  const location = useLocation();
  const navigate = useNavigate();

  // 로그인 여부 확인 & 로그인한 유저 정보 조회
  const isLogged = useRecoilValue(LoginState);
  const data = location.state.data;
  const loginData = data.loginData;
  // console.log("state", data);

  // state를 통해 받아온 데이터 저장 (user : 답변자)

  const user = data.user;

  const BASE_URL = useRecoilValue(base_url);

  const userId = user.id;
  const [questions, setQuestions] = useState();
  const getQuestions = async (userId) => {
    const data = await axios.get(`${BASE_URL}/questions/to/${userId}`);
    setQuestions(data.data);
  };

  useEffect(() => {
    getQuestions(userId);
  }, []);

  // 로그인하지 않은 유저가 접근하면 alert
  const alertAuth = () => {
    alert("로그인이 필요합니다.");
  };

  // upvote 버튼 클릭 시
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
            alert("이미 추천하셨습니다.");
          } else {
            window.location.reload();
          }
        });
    }
  };

  // 답변 목록 모달창
  // const [modalIsOpen, setModalIsOpen] = useState(false);

  // const openModal = () => {
  //   setModalIsOpen(true);
  // };

  // const closeModal = () => {
  //   setModalIsOpen(false);
  // };

  // console.log(questions);

  // userDetail의 id와 로그인된 유저의 id를 비교하기 위함
  const params = useParams();
  const loginUser = useRecoilValue(loginInfo);
  // console.log(loginUser);

  const buttonControl = () => {
    if (isLogged && parseInt(loginUser.id) !== parseInt(params.id)) {
      return (
        <Button state={{ user: user }} to={`/to${user.id}/askQuestion`}>
          질문 남기기
        </Button>
      );
    } else if (isLogged && parseInt(loginUser.id) === parseInt(params.id)) {
      return <Button to={`/mypage/${loginUser.id}`}>마이페이지</Button>;
    } else {
      return <ButtonToLogin onClick={alertAuth}>질문 남기기</ButtonToLogin>;
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Profile>
          <UserPic src={user.userPic} />
          <h1>{user.nickname}</h1>
          <p>
            {user.job} | {user.company}
          </p>
          <span>{user.desc}</span>
        </Profile>
        {/* {isLogged ? (
          // 로그인한 유저가 자신의 페이지에 접근할 경우
          <Button state={{ user: user }} to={`/to${user.id}/askQuestion`}>
            질문 남기기
          </Button>
        ) : (
          <ButtonToLogin onClick={alertAuth}>질문 남기기</ButtonToLogin>
        )} */}
        {buttonControl()}
        <Questions>
          <Title>Q&A</Title>
          {questions &&
            questions.map((question) => (
              <QuestionBox key={question.id}>
                <TextGroup
                  onClick={() => {
                    question.answers.length === 0
                      ? alert("답변이 없습니다.")
                      : navigate(`/answer/${question.answers[0].id}`);
                  }}
                >
                  <h1>{question.title}</h1>
                  <p>from {question.questioner.nickname}</p>
                </TextGroup>
                <LikeBtn
                  onClick={() => {
                    onClickLike(question.id);
                  }}
                >
                  <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                  <p>{question.upvote}</p>
                </LikeBtn>
                {/* 답변 목록 모달창 */}
                {/* <Modal
                  style={modalStyles}
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                >
                  <ModalContent>
                    {question.answers.map((answer) => (
                      <Link key={answer.id} to={`/answer/${answer.id}`}>
                        <AnswerBox>
                          <p>{answer.id}</p>
                          <h1>{answer.answerer.nickname}님의 답변</h1>
                          <p>
                            {answer.answerer.company} | {answer.answerer.job}
                          </p>
                        </AnswerBox>
                      </Link>
                    ))}
                    <Xmark icon={faXmark} onClick={closeModal} />
                  </ModalContent>
                </Modal> */}
              </QuestionBox>
            ))}
        </Questions>
      </Container>
    </>
  );
}

export default UserDetail;

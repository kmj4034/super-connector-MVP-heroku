import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { base_url } from "../atoms";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { checkLoggedIn, loginInfo, LoginState } from "../states/LoginState";
import { isEnrolled } from "../states/LoginState";
import { Helmet } from "react-helmet";

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 8%;
`;
const Container = styled.div`
  padding: 8%;
`;
const SubmitBox = styled.div`
  width: 100%;
  padding: 5%;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  margin: 5vh 0 8vh 0;
`;
const UserBox = styled(SubmitBox)`
  background-color: #fff;
  border-radius: 0;
  h1 {
    margin: 0;
  }
  display: flex;
  justify-content: flex-start;
`;
const UserPic = styled.img`
  width: 20vw;
  height: 20vw;
  border-radius: 50%;
  display: block;
  margin-right: 5vw;
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
  },
};
const ModalContent = styled.form`
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

function Home() {
  axios.defaults.withCredentials = true;

  // 로그인 여부 & 로그인유저 데이터
  const [isLogged, setIsLogged] = useRecoilState(LoginState);

  const [loginData, setLoginData] = useRecoilState(loginInfo);
  const [enrolled, setEnrolled] = useRecoilState(isEnrolled);

  const BASE_URL = useRecoilValue(base_url);

  // 로그인 유저가 스페셜리스트로 등록되어 있는지 확인
  // const enrolled = useRecoilValue(isEnrolled);
  // const setEnrolled = useSetRecoilState(isEnrolled);

  const getLogInData = async () => {
    const data = await axios.get(`${BASE_URL}/auth/checkLoggedIn`);

    setLoginData(data.data.user);
    // 로그인 상태로 변경
    setIsLogged(data.data.isLoggedIn);
    if (isLogged) {
      setEnrolled(Boolean(loginData.isAnswerer));
    }
    // console.log("loginData", loginData);
    // console.log("enrolled", enrolled);
  };

  const [users, setUsers] = useState([]);

  // 답변자로 등록된 유저 정보 조회
  const getEnrolledUsers = async () => {
    const users = await axios.get(`${BASE_URL}/user/getEnrolledUsers`);
    setUsers(users.data);
    // console.log(users.data);
  };

  // 답변자 등록
  const enrollAnswerer = async () => {
    await axios.patch(`${BASE_URL}/user/enrollAnswerer`, {
      isAnswerer: true,
    });
    window.location.reload(); // 새로고침이 안됨. 이유는 모르겠다.
  };
  const enrollClick = () => {
    isLogged ? enrollAnswerer() : alert("로그인이 필요합니다.");
  };

  useEffect(() => {
    getLogInData();
    getEnrolledUsers();
  }, []);

  // Modal
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Super Connector</title>
      </Helmet>
      <Header />
      <Container>
        <Title>
          Super Connector에 <br />
          오신 것을 환영합니다!
        </Title>
        <Title>
          내 고민을 해결해줄 <br />
          스페셜리스트를 찾아 보세요
        </Title>
        {enrolled ? (
          <></>
        ) : (
          <SubmitBox onClick={openModal}>
            <p>스페셜리스트 등록하기</p>
          </SubmitBox>
        )}

        <Modal
          style={modalStyles}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
        >
          <ModalContent>
            <h3>스페셜리스트로 등록하시겠습니까?</h3>
            <button onClick={enrollClick}>등록</button>
            <button onClick={closeModal}>취소</button>
          </ModalContent>
        </Modal>
        {users.map((user) => (
          // state 사용해서 data 넘겨주자
          <Link
            state={{ data: { user, loginData } }}
            to={`/${user.id}`}
            key={user.id}
          >
            <UserBox>
              <UserPic src={user.userPic} />
              <div>
                <Title>{user.nickname}</Title>
                <p>
                  {user.job} | {user.company}
                </p>
              </div>
            </UserBox>
          </Link>
        ))}
      </Container>
    </>
  );
}

export default Home;

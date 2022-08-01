import React, { useEffect } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { base_url } from "../atoms";
import { Link } from "react-router-dom";
import axios from "axios";
import { LoginState } from "../states/LoginState";

const Container = styled.div``;
const Box = styled.div`
  padding: 8%;
  font-size: 1.2rem;
`;
const LinkBox = styled(Link)`
  padding: 8%;
  font-size: 1.2rem;
  display: block;
`;
const ModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8%;
`;

function Menu() {
  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "30px",
      backgroundColor: "#fff",
      border: 0,
      width: "80vw",
    },
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // 로그인 여부
  const isLogged = useRecoilValue(LoginState);

  const BASE_URL = useRecoilValue(base_url);

  // 로그인한 유저 정보 조회
  const [userInfo, setUserInfo] = useState("");

  const getUserInfo = async () => {
    const user = await axios.get(`${BASE_URL}/user`);
    setUserInfo(user.data);
  };

  // 로그인 상태일때 로그
  useEffect(() => {
    if (isLogged) {
      getUserInfo();
    }
  }, []);

  return (
    <Container>
      {isLogged ? (
        <>
          <LinkBox to={`/mypage/${userInfo.id}`}>마이페이지</LinkBox>
        </>
      ) : (
        <>
          <Box onClick={openModal}>로그인/회원가입</Box>
          <Modal
            style={modalStyles}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
          >
            <ModalContent>
              <a href={`${BASE_URL}/auth/kakao`}>카카오 로그인</a>
            </ModalContent>
          </Modal>
        </>
      )}
      {isLogged ? (
        <>
          <Box>
            <a href={`${BASE_URL}/auth/kakao/logout`}>로그아웃</a>
          </Box>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default Menu;

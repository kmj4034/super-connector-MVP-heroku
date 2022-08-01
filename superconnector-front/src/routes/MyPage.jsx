import React, { useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Modal from "react-modal";
import { useState } from "react";
import axios from "axios";
import { base_url } from "../atoms";
import { useRecoilValue } from "recoil";
import { userInfoSelector } from "../atoms";
import { Link, Outlet, useMatch } from "react-router-dom";

const Profile = styled.div`
  padding: 8%;
`;
const MainBox = styled.div`
  display: flex;
  padding: 8%;
  background-color: #d9d9d9;
  border-radius: 10px;
  align-items: center;
`;
const Desc = styled.div`
  margin-top: 5%;
  p {
    margin-top: 1vh;
  }
  span {
    display: block;
    margin: 3vh 0 3vh;
  }
`;
const UserPic = styled.img`
  width: 20vw;
  height: 20vw;
  border-radius: 50%;
  display: block;
`;
const Wrapper = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 5px;
  }
  p {
    color: rgba(161, 161, 161, 1);
    margin-bottom: 10px;
  }
  margin-left: 10%;
  label {
    background: #f5f5f5;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    border: 0;
    padding: 1vh 2vh;
    margin-top: 1vh;
    width: 100%;
    display: block;
  }
`;
const UploadImage = styled.input`
  display: none;
`;
const Button = styled.button`
  background: #f5f5f5;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 0;
  padding: 3% 5%;
  width: 100%;
`;
const ModalContent = styled.form`
  padding: 15% 0;
  font-size: 1.2rem;
  text-align: center;
  button {
    margin: 10% 5% 0;
    background: #f5f5f5;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    border: 0;
    padding: 5%;
    width: 100%;
  }
`;
const ModalElement = styled.div`
  margin-bottom: 2vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  label {
    margin-right: 10px;
  }
  input {
    border: 1px solid black;
    padding: 10px;
  }
`;
const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid black;
  border-right: 0;
  border-left: 0;
`;
const Tab = styled(Link)`
  margin-right: 10px;
  border-bottom: ${(props) => (props.$isActive ? "3px solid black" : "0")};
  /* background-color: red; */
  width: 100%;
  height: 100%;
  text-align: center;
  display: block;
  padding: 2vh 0;
  :last-child {
    margin-right: 0;
  }
`;

function MyPage() {
  // BASE URL
  const BASE_URL = useRecoilValue(base_url);

  // Modal
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

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // 이미지 업로드
  const [img, setImg] = useState("");
  axios.defaults.withCredentials = true;

  const formSubmit = async (e) => {
    const img = e.target.files[0];
    const formData = new FormData();
    formData.append("file", img);

    await axios
      .post(`${BASE_URL}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setImg(res.data.location);
        alert("성공");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 유저 정보 조회
  const user = useRecoilValue(userInfoSelector).data;

  // 유저 정보 입력
  // onChange이벤트를 따로따로 여러개 만들어서 쓰는 것보다 이렇게 객체를 만들어서 할당해주는 방식이 더 좋음
  const [userInputs, setUserInputs] = useState({
    nickname: user.nickname,
    job: user.job,
    company: user.company,
    desc: user.desc,
  });

  const { nickname, job, company, desc } = userInputs;

  const onChangeInputs = (e) => {
    // 구조분해할당! name = e.target.name, value = e.target.value
    const { name, value } = e.target;
    setUserInputs({
      ...userInputs,
      [name]: value,
    });
  };

  // 직업, 직장, 자기소개 중 변경 사항 있는 것만 업데이트. 변경 사항 없는건 기존값 그대로 씀
  const onSubmit = async () => {
    await axios.patch(`${BASE_URL}/user/updateProfile`, {
      // ES6 문법!
      nickname,
      job,
      company,
      desc,
    });
  };

  const fromMatch = useMatch("/mypage/:mypageId/fromMe");
  const toMatch = useMatch("/mypage/:mypageId/toMe");

  const userPic = user.userPic;
  return (
    <>
      <Header />
      <Profile>
        <MainBox>
          <UserPic src={userPic} />
          <Wrapper>
            <h1>{user.nickname}</h1>
            <p>{user.email}</p>
            <UploadImage
              type="file"
              accept="image/*"
              id="file"
              name="file"
              onChange={formSubmit}
            ></UploadImage>
            <label htmlFor="file">프로필 사진 변경</label>
          </Wrapper>
        </MainBox>
        <Desc>
          <p>직업 | {user.job}</p>
          <p>직장 | {user.company}</p>
          <span>{user.desc}</span>
        </Desc>
        <Button onClick={openModal}>프로필 수정</Button>
        {/* 프로필 수정 모달 */}
        <Modal
          style={modalStyles}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
        >
          <ModalContent onSubmit={onSubmit}>
            <ModalElement>
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                name="nickname"
                defaultValue={user.nickname}
                placeholder={user.nickname}
                onChange={onChangeInputs}
              />
            </ModalElement>
            <ModalElement>
              <label htmlFor="job">직업</label>
              <input
                type="text"
                name="job"
                defaultValue={user.job}
                placeholder={user.job}
                onChange={onChangeInputs}
              />
            </ModalElement>
            <ModalElement>
              <label htmlFor="company">직장</label>
              <input
                type="text"
                name="company"
                defaultValue={user.company}
                placeholder={user.company}
                onChange={onChangeInputs}
              />
            </ModalElement>
            <ModalElement>
              <label htmlFor="desc">자기소개</label>
              <input
                type="text"
                name="desc"
                defaultValue={user.desc}
                placeholder={user.desc}
                onChange={onChangeInputs}
              />
            </ModalElement>
            <ModalElement>
              <button>변경완료</button>
              <button>취소</button>
            </ModalElement>
          </ModalContent>
        </Modal>
      </Profile>
      <Tabs>
        <Tab $isActive={fromMatch !== null} to={"fromMe"}>
          내가 보낸 질문
        </Tab>
        <Tab $isActive={toMatch !== null} to={"toMe"}>
          나한테 온 질문
        </Tab>
      </Tabs>
      <Outlet context={{ user }} />
    </>
  );
}

export default MyPage;

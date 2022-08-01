import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import Menu from "./Menu";
import logoImg from "../assets/logo.png";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5%;
  border-bottom: 2px solid black;
  align-items: center;
`;

const Logo = styled.img`
  width: 9vw;
  height: 9vw;
`;

const MenuBar = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
`;

function Header() {
  const [state, setState] = useState({
    isPaneOpen: false,
  });
  const navigate = useNavigate();

  return (
    <Container>
      <Logo src={logoImg} onClick={() => navigate("/")} />
      <MenuBar icon={faBars} onClick={() => setState({ isPaneOpen: true })} />
      <SlidingPane
        isOpen={state.isPaneOpen}
        from="right"
        width="300px"
        onRequestClose={() => setState({ isPaneOpen: false })}
        hideHeader={true}
      >
        <Menu />
      </SlidingPane>
    </Container>
  );
}

export default Header;

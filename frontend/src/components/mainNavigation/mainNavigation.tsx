import React, { Fragment, useState } from "react";
import "./mainNavigation.css";
import facebook from "../../facebook.png";
import {
  HomeOutlined,
  MenuOutlined,
  PeopleOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { resourceEndPoint } from "../../API/apiEndpoint";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { logoutHandler } from "../../API/authAPI";
import { AuthAction } from "../../redux/reducer";
import { Menu } from "@mui/material";

const MainNavigation = (props: any) => {
  const [showSideNav, setShowSideNav] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = useSelector((state: any) => state.auth.userId);
  const token = useSelector((state: any) => state.auth.token);
  const CustomToggle: any = React.forwardRef<any>(
    ({ children, onClick }: any, ref) => (
      <div
        ref={ref}
        onClick={(e: { preventDefault: () => void }) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </div>
    )
  );
  return (
    <Fragment>
      <div
        style={{ width: showSideNav ? "250px" : "0px" }}
        id="mySidenav"
        className="sidenav"
      >
        <div onClick={() => setShowSideNav(false)} className="closebtn">
          &times;
        </div>
        <div
          onClick={() => {
            navigate("/home", { replace: false });
            setShowSideNav(false);
          }}
        >
          Home
        </div>
        <div
          onClick={() => {
            navigate("/messages", { replace: false });
            setShowSideNav(false);
          }}
        >
          Messages
        </div>
        <div
          onClick={() => {
            navigate("/friends", { replace: false });
            setShowSideNav(false);
          }}
        >
          Friends
        </div>
        <div
          onClick={() => {
            navigate("/search", { replace: false });
            setShowSideNav(false);
          }}
        >
          Search
        </div>
      </div>
      <div
        style={{ marginLeft: showSideNav ? "250px" : "0px" }}
        className="mainNavigation-container"
      >
        {userId && (
          <div
            onClick={() => {
              setShowSideNav(true);
            }}
            className="mainNavigation-container__sidebar"
          >
            <MenuOutlined />
          </div>
        )}
        <div className="mainNavigation-container__img">
          <img src={facebook}></img>
        </div>
        <div className="mainNavigation__stack">
          {userId && (
            <>
              <div
                onClick={() => navigate("/home", { replace: false })}
                className="mainNavigation__stack-element"
              >
                <HomeOutlined />
              </div>
              <div
                onClick={() => navigate("/myProfile", { replace: false })}
                className="mainNavigation__stack-profileImage"
              >
                <img src={resourceEndPoint + `/${userData.ProfilePic}`}></img>
              </div>
              <div
                onClick={() => navigate("/friends", { replace: false })}
                className="mainNavigation__stack-element"
              >
                <PeopleOutlined />
              </div>
            </>
          )}
        </div>
        {userId && (
          <div className="mainNavigation__setting-element">
            <Dropdown autoClose={true}>
              <Dropdown.Toggle
                as={CustomToggle}
                id="dropdown-custom-components"
              >
                <SettingsOutlined />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    logoutHandler(userId)
                      .then((_response) => {
                        dispatch(AuthAction.logout());
                        navigate("/", { replace: true });
                      })
                      .catch((err) => console.log(err))
                  }
                  eventKey="1"
                >
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </div>
      <main
        style={{ marginLeft: showSideNav ? "250px" : "0px" }}
        className="navigation-children"
      >
        {props.children}
      </main>
    </Fragment>
  );
};
export default MainNavigation;

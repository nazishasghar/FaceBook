import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { resourceEndPoint } from "../../API/apiEndpoint";
import { getUserbyId } from "../../API/userApi";
import "./messageComponent.css";

interface MessageComponentProps {
  SentBy: string;
  Message: string;
}

const MessageComponent: FunctionComponent<MessageComponentProps> = ({
  Message,
  SentBy,
}) => {
  const [user, setUser] = useState(null);
  const token = useSelector((state: any) => state.auth.token);
  const tokenConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  useEffect(() => {
    getUserbyId(SentBy, tokenConfig)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="message-container__Component">
      <div className="message-container__initails">
        <div className="message-container__img">
          <img src={resourceEndPoint + `/${user && user.ProfilePic}`}></img>
        </div>
        <div>
          <div className="message-container__name">
            <p>{user && user.Name}</p>
            <p id="time">36 min ago</p>
          </div>
        </div>
      </div>
      <div className="message-container__Messages">
        <p>{Message}</p>
      </div>
    </div>
  );
};

export default MessageComponent;

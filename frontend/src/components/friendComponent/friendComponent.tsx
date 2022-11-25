import { Person } from "@mui/icons-material";
import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resourceEndPoint } from "../../API/apiEndpoint";
import "./friendComponent.css";

interface FriendComponentProps {
  imageUrl: string;
  name: string;
  status: boolean;
  friend?: boolean;
  item?: any;
  messages?: Array<any>;
}

const FriendComponent: FunctionComponent<FriendComponentProps> = ({
  imageUrl,
  name,
  status,
  friend = true,
  messages,
  item,
}) => {
  let navigate = useNavigate();
  return (
    <div className="friend-component__container">
      <div className="friend-component__initials">
        <div className="friend-component__image">
          <img src={resourceEndPoint + `/${imageUrl}`}></img>
        </div>
        <div className="friend-component__initialsText">
          <p className="friend-component__name">{name}</p>
          {friend && (
            <p className="friend-component__status">
              {status === true ? "Online" : "Offline"}
            </p>
          )}
          {messages &&
            messages.slice(-1).map((item) => {
              return <p>{item.Content}</p>;
            })}
        </div>
      </div>
      {friend && (
        <div
          onClick={() =>
            navigate("/myProfile", { replace: false, state: { item } })
          }
          className="friend-component__connect"
        >
          <Person />
        </div>
      )}
    </div>
  );
};

export default FriendComponent;

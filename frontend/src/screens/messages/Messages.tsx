import { SendOutlined } from "@mui/icons-material";
import React, { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessageForUser, sendMessage } from "../../API/messageAPI";
import FriendComponent from "../../components/friendComponent/friendComponent";
import { MessageAction } from "../../redux/reducer";
import "./Messages.css";
interface MessagesProps {}

const Messages: FunctionComponent<MessagesProps> = () => {
  const [showChat, setShowChat] = useState(false);
  const [friendId, setFriendId] = useState(null);
  const messageRef = React.useRef<HTMLInputElement>(null);
  const friends = useSelector((state: any) => state.friends.friends);
  const messages = useSelector((state: any) => state.messages.messages);
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.auth.userId);
  const token = useSelector((state: any) => state.auth.token);
  const tokenConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  return (
    <div className="message-container__main">
      {friends.length > 0 ? (
        <div className="chat-container">
          <div className="chat-container__chatList">
            {friends.map((item) => {
              return (
                <div
                  onClick={() => {
                    setFriendId(item._id);
                    getMessageForUser(item._id, tokenConfig)
                      .then((response) => {
                        const messages = response.data.messages;
                        dispatch(MessageAction.getMessages({ messages }));
                        setShowChat(true);
                      })
                      .catch((err) => console.log(err));
                  }}
                  className="chat-container__chatListElement"
                >
                  <FriendComponent
                    imageUrl={item.ProfilePic}
                    name={item.Name}
                    status={item.isOnline}
                    friend={false}
                    messages={item.Messages}
                  />
                </div>
              );
            })}
          </div>
          {showChat && (
            <div className="chat-container__message">
              <div className="chat-container__message-window">
                {messages &&
                  messages.map((item) => {
                    return (
                      <div
                        style={{
                          textAlign: item.SentBy === userId ? "end" : "start",
                        }}
                        className="chat-container__message-windowText"
                      >
                        <div style={{ width: "100%", padding: "0.5rem" }}>
                          <p>{item.Content}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="chat-container__message-windowInputContainer">
                <div className="chat-container__message-windowInput">
                  <input ref={messageRef} placeholder="Enter Message"></input>
                </div>
                <div
                  onClick={() => {
                    sendMessage(
                      userId,
                      friendId,
                      messageRef.current.value,
                      tokenConfig
                    )
                      .then((response) => {
                        const message = response.data.createdMessage;
                        messageRef.current.value = "";
                        dispatch(MessageAction.sendMessage({ message }));
                      })
                      .catch((err) => console.log(err));
                  }}
                  className="chat-container__message-windowInputButton"
                >
                  <SendOutlined sx={{ fontSize: "2rem" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <h1 style={{ fontSize: "5rem" }}>Add friend to start chatting</h1>
      )}
    </div>
  );
};

export default Messages;

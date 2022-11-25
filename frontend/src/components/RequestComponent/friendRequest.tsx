import React, { FunctionComponent } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { resourceEndPoint } from "../../API/apiEndpoint";
import { addFriend, rejectRequest } from "../../API/friendsAPI";
import { AuthAction, FriendsAction } from "../../redux/reducer";
import "./friendRequest.css";

interface FriendRequestProps {
  ProfilePic: string;
  Name: string;
  id: string;
}

const FriendRequest: FunctionComponent<FriendRequestProps> = ({
  ProfilePic,
  Name,
  id,
}) => {
  const userId = useSelector((state: any) => state.auth.userId);
  let dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);
  const tokenConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  return (
    <div className="request-container">
      <div className="request-container__initails">
        <div className="request-container__img">
          <img src={resourceEndPoint + `/${ProfilePic}`}></img>
        </div>
        <div className="request-container__Name">
          <p>{Name}</p>
        </div>
      </div>
      <div className="request-container__action">
        <div className="request-container__actionElement">
          <Button
            onClick={() => {
              addFriend(userId, id, tokenConfig)
                .then((response) => {
                  const addFriend = response.data.addedFriend;
                  const id = response.data.addedFriend._id;
                  dispatch(FriendsAction.addFriend({ addFriend }));
                  dispatch(AuthAction.removeRequest({ id }));
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            variant="primary"
          >
            Accept
          </Button>{" "}
        </div>
        <div className="request-container__actionElement">
          <Button
            onClick={() =>
              rejectRequest(userId, id, tokenConfig)
                .then((response) => {
                  const id = response.data.removeSentRequestFromUserId;
                  dispatch(AuthAction.removeRequest({ id }));
                })
                .catch((err) => {
                  console.log(err);
                })
            }
            variant="outline-primary"
          >
            Reject
          </Button>{" "}
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;

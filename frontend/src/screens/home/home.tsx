import {
  AddCircleOutlineOutlined,
  EmailOutlined,
  NotificationsNoneOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { getAllPost } from "../../API/postAPI";
import { createStory, getAllStories } from "../../API/storyAPI";
import CreatePost from "../../components/createPost/createPost";
import Post from "../../components/post/post";
import StoryComponent from "../../components/storiesComponent/StoryComponent";
import { calculateRemainingTime } from "../../helperFunction";
import {
  AuthAction,
  FriendsAction,
  MessageAction,
  PostAction,
  StoryAction,
} from "../../redux/reducer";
import "./home.css";
import { Dropdown } from "react-bootstrap";
import { getAllFriends, getRequestDetail } from "../../API/friendsAPI";
import FriendComponent from "../../components/friendComponent/friendComponent";
import MessageComponent from "../../components/messageComponent/messageComponent";
import { getMessageForUser } from "../../API/messageAPI";
import FriendRequest from "../../components/RequestComponent/friendRequest";
import { getUserbyId } from "../../API/userApi";
import { RootState } from "../../redux/store";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

const Home = () => {
  const token: string = useSelector((state: RootState) => state.auth.token);
  const tokenConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const multimediaConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  };

  let dispatch: Dispatch<AnyAction> = useDispatch();
  let navigate: NavigateFunction = useNavigate();
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
  const expirationTime: string = useSelector(
    (state: RootState) => state.auth.expirationTime
  );
  const userId: string = useSelector((state: RootState) => state.auth.userId);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const stories: Array<any> = useSelector(
    (state: RootState) => state.stories.stories
  );
  const posts: Array<any> = useSelector(
    (state: RootState) => state.posts.posts
  );
  const friends: Array<any> = useSelector(
    (state: RootState) => state.friends.friends
  );
  const messages: Array<any> = useSelector(
    (state: RootState) => state.messages.messages
  );
  let time: number = calculateRemainingTime(new Date(expirationTime));
  const storyRef: React.MutableRefObject<HTMLInputElement> =
    React.useRef<HTMLInputElement>(null);
  const handleChange = (event) => {
    let formData: FormData = new FormData();
    formData.append("imageUrl", storyRef.current.files[0]);
    formData.append("userId", userId);
    createStory(multimediaConfig, formData)
      .then((response) => {
        const createdStory = response.data.story;
        dispatch(StoryAction.addStories({ createdStory }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setTimeout(() => {
      dispatch(AuthAction.logout());
      navigate("/", { replace: true });
    }, time);
    getAllStories(tokenConfig)
      .then((response) => {
        const stories = response.data.stories;
        console.log(stories);
        dispatch(StoryAction.getStories({ stories }));
      })
      .catch((err) => console.log(err));
    getAllPost(tokenConfig)
      .then((response) => {
        const posts = response.data.posts;
        console.log(posts);
        dispatch(PostAction.getPosts({ posts }));
      })
      .catch((err) => console.log(err));
    getAllFriends(tokenConfig, userId)
      .then((response) => {
        const friends = response.data.friends;
        console.log(friends);
        dispatch(FriendsAction.getFriends({ friends }));
      })
      .catch((err) => {
        console.log(err);
      });
    getMessageForUser(userId, tokenConfig)
      .then((response) => {
        const messages = response.data.messages;
        console.log(messages);
        dispatch(MessageAction.getMessages({ messages }));
      })
      .catch((err) => {
        console.log(err);
      });
    getRequestDetail(userId, tokenConfig)
      .then((response) => {
        const requests = response.data.request;
        console.log(requests);
        dispatch(AuthAction.getRequest({ requests }));
      })
      .catch((err) => {
        console.log(err);
      });
    getUserbyId(userId, tokenConfig)
      .then((response) => {
        const updatedUser = response.data;
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        dispatch(AuthAction.updateUser({ updatedUser }));
      })
      .catch((err) => console.log(err));
  }, [dispatch]);
  return (
    <div className="home-container">
      <div className="home-container__one">
        <div onClick={() => {}} className="container-one__addStory">
          <label htmlFor="imageUrl">
            <AddCircleOutlineOutlined
              sx={{ fontSize: "4rem", cursor: "pointer" }}
            />
          </label>
          <input
            onChange={(event) => handleChange(event)}
            style={{ display: "none" }}
            onSubmit={() => {
              let formData = new FormData();
              formData.append("imageUrl", storyRef.current.files[0]);
              formData.append("userId", userId);
              createStory(multimediaConfig, formData)
                .then((response) => {
                  const createdStory = response.data.story;
                  dispatch(StoryAction.addStories({ createdStory }));
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            ref={storyRef}
            type="file"
            id="imageUrl"
          ></input>
        </div>
        <div className="container-one__connect">
          <div onClick={() => navigate("/messages", { replace: false })}>
            <EmailOutlined sx={{ fontSize: "2.5rem", cursor: "pointer" }} />
          </div>
          <div onClick={() => navigate("/search", { replace: false })}>
            <SearchOutlined sx={{ fontSize: "2.5rem", cursor: "pointer" }} />
          </div>
          <div>
            {userData.Requests.length > 0 && (
              <div className="notification-count">
                {userData.Requests.length}
              </div>
            )}
            <Dropdown autoClose={true}>
              <Dropdown.Toggle
                as={CustomToggle}
                id="dropdown-custom-components"
              >
                <NotificationsNoneOutlined
                  sx={{ fontSize: "2.5rem", cursor: "pointer" }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>
                  {userData.Requests.length > 0 &&
                    userData.Requests.map((item) => {
                      return (
                        <FriendRequest
                          id={item._id}
                          ProfilePic={item.ProfilePic}
                          Name={item.Name}
                        />
                      );
                    })}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="home-container__two">
        <div className="home-container__twohalf">
          <div className="stories-container">
            <h2 style={{ margin: "0 0 2rem 0" }}>Stories</h2>
            {stories.map((item: any) => {
              return (
                <div className="stories-container__element">
                  <StoryComponent
                    creatorName={item.creatorName}
                    key={item._id}
                    creatorImage={item.creatorImage}
                    imageUrl={item.imageUrl}
                  />
                </div>
              );
            })}
          </div>
          <div className="createPost-Container">
            <h2>Create Post</h2>
            <CreatePost />
          </div>
        </div>
        <div className="home-container__twoOther">
          <div className="post-container">
            <h2>Post</h2>
            {posts.map((item: any) => {
              return (
                <div style={{ paddingTop: "1rem" }}>
                  <Post
                    key={item.id}
                    id={item.id}
                    imageUrl={item.ImageUrl}
                    ProfilePic={item.ProfilePic}
                    Likes={item.Likes}
                    Comments={item.Comments}
                    caption={item.Caption}
                    user={item.User}
                  />
                </div>
              );
            })}
          </div>
          <div className="friends-container">
            <h2>Friends</h2>
            {friends.length > 0 ? (
              friends.map((item) => {
                return (
                  <FriendComponent
                    item={item && item}
                    imageUrl={item.ProfilePic && item.ProfilePic}
                    name={item.Name && item.Name}
                    status={item.Name && item.isOnline}
                  />
                );
              })
            ) : (
              <h5>No friend</h5>
            )}
          </div>
        </div>
      </div>
      <div className="home-container__three">
        <div className="message-container">
          <h2>Messages</h2>
          {messages.length > 0 ? (
            messages.map((item) => {
              if (item.SentBy !== userId) {
                return (
                  <div className="message-container__element">
                    <MessageComponent
                      Message={item.Content}
                      SentBy={item.SentBy}
                    />
                  </div>
                );
              }
            })
          ) : (
            <h5>No messages</h5>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

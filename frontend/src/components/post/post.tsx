import {
  MessageOutlined,
  MoreHorizOutlined,
  MoreOutlined,
  SendOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from "@mui/icons-material";
import axios from "axios";
import React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { resourceEndPoint, userEndPoint } from "../../API/apiEndpoint";
import {
  commentOnPost,
  deletePost,
  disLikeOnPost,
  sendLikeOnPost,
} from "../../API/postAPI";
import { PostAction } from "../../redux/reducer";
import "./post.css";

interface PostProps {
  id: string;
  caption: string;
  user: string;
  imageUrl: string;
  Likes: number;
  ProfilePic: string;
  Comments: Array<any>;
}

const Post: FunctionComponent<PostProps> = ({
  id,
  user,
  caption,
  imageUrl,
  Likes,
  ProfilePic,
  Comments,
}) => {
  let islikedbyUser;
  let dispatch = useDispatch();

  const token = useSelector((state: any) => state.auth.token);
  const posts = useSelector((state: any) => state.posts.posts);
  const userId = useSelector((state: any) => state.auth.userId);
  const [liked, setisLiked] = useState(islikedbyUser);
  const [showModal, setShowModal] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [name, setName] = useState("");
  const commentRef = React.useRef<HTMLInputElement>(null);
  Comments = Comments.slice(-2);
  const tokenConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  let button;

  useEffect(() => {
    let post = posts.find((item: any) => item.id === id);
    islikedbyUser = post.LikedBy.find((item) => item === userId);
    setisLiked(islikedbyUser);
    axios
      .get(userEndPoint + `/${user}`, tokenConfig)
      .then((response) => setName(response.data.Name))
      .catch((err) => console.log(err));
  }, []);
  if (liked) {
    button = (
      <div
        className="dislike-button"
        onClick={() =>
          disLikeOnPost(tokenConfig, id, userId)
            .then((response) => {
              dispatch(PostAction.disLikeOnPost({ id }));
              setisLiked(null);
            })
            .catch((err) => console.log(err))
        }
      >
        <ThumbUp />
      </div>
    );
  } else {
    button = (
      <div
        onClick={() =>
          sendLikeOnPost(tokenConfig, id, userId)
            .then((response) => {
              dispatch(PostAction.likeOnPost({ id }));
              setisLiked(response.data);
            })
            .catch((err) => console.log(err))
        }
      >
        <ThumbUpOutlined />
      </div>
    );
  }
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
    <div className="post-maincontainer">
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete Post!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              deletePost(tokenConfig, id)
                .then((response) => {
                  dispatch(PostAction.deletePost({ id }));
                })
                .catch((err) => console.log(err));
            }}
            variant="danger"
          >
            Delete Post
          </Button>{" "}
        </Modal.Footer>
      </Modal>
      <div className="post-control">
        <div className="post-container__one">
          <div className="post-container__initails">
            <div className="post-container__initails-profile">
              <img src={resourceEndPoint + `/${ProfilePic}`}></img>
            </div>
            <div className="post-container__initailsName">
              <p>{name}</p>
            </div>
          </div>
          <div className="post-container__delete">
            <Dropdown autoClose={true}>
              <Dropdown.Toggle
                as={CustomToggle}
                id="dropdown-custom-components"
              >
                <MoreHorizOutlined />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowModal(true)} eventKey="1">
                  Delete Post
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <h4 style={{ textAlign: "start", width: "100%", paddingLeft: "2rem" }}>
          {caption}
        </h4>
        <div className="post-container__mainImage">
          <img src={resourceEndPoint + `/${imageUrl}`}></img>
        </div>
        <div className="post-container__likesCount">{`Liked by ${Likes}`}</div>
        <div className="post-container__commentContainer">
          {Comments.map((item) => {
            return (
              <div className="post-container__comment">
                <p className="post-container__commentBy">
                  {item && item.CommentBy}
                </p>
                <p className="post-container-comment">{item && item.Comment}</p>
              </div>
            );
          })}
        </div>
        <div className="post-container__action">
          {button}
          <div onClick={() => setShowComment(!showComment)}>
            <MessageOutlined />
          </div>
        </div>
        {showComment && (
          <div className="post-container__commentInput">
            <input ref={commentRef} placeholder="Enter Comment"></input>
            <div
              onClick={() => {
                const Comment = {
                  CommentBy: name,
                  Comment: commentRef.current.value,
                };
                commentOnPost(tokenConfig, id, Comment)
                  .then((response) => {
                    const Comment = response.data.Comment;
                    dispatch(PostAction.commentOnPost({ id, Comment }));
                    setShowComment(false);
                  })
                  .catch((err) => console.log(err));
              }}
            >
              <SendOutlined sx={{ fontSize: "2rem" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;

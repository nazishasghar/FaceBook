import { AttachFileOutlined } from "@mui/icons-material";
import React from "react";
import { FunctionComponent } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../API/postAPI";
import { PostAction } from "../../redux/reducer";
import "./createPost.css";

interface CreatePostProps {}

const CreatePost: FunctionComponent<CreatePostProps> = () => {
  const userId = useSelector((state: any) => state.auth.userId);
  const userData = useSelector((state: any) => state.auth.userData);
  const token = useSelector((state: any) => state.auth.token);
  const dispatch = useDispatch();
  const multimediaConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  };
  const imageRef = React.useRef<HTMLInputElement>(null);
  const captionRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="create-post__container">
      <div className="create-post__imageSelector">
        <label htmlFor="ImageUrl">
          <AttachFileOutlined sx={{ fontSize: "2rem" }} />
        </label>
        <input
          style={{ display: "none" }}
          ref={imageRef}
          id="ImageUrl"
          type="file"
          name="ImageUrl"
          accept=".jpg,.jpeg,.png"
        ></input>
      </div>
      <div className="create-post__cationfield">
        <input placeholder="Write Some Caption" ref={captionRef}></input>
      </div>
      <div style={{ padding: "1rem" }}>
        <Button
          className="post-container__publish"
          onClick={() => {
            let formdata = new FormData();
            formdata.append("Likes", JSON.stringify(0));
            formdata.append("Caption", captionRef.current.value);
            formdata.append("User", userId);
            formdata.append("ProfilePic", userData.ProfilePic);
            formdata.append("ImageUrl", imageRef.current.files[0]);
            createPost(multimediaConfig, formdata)
              .then((response) => {
                const createdPost = response.data.createdPost;
                captionRef.current.value = "";
                dispatch(PostAction.addPost({ createdPost }));
              })
              .catch((err) => console.log(err));
          }}
          variant="outline-primary"
        >
          Publish
        </Button>{" "}
      </div>
    </div>
  );
};

export default CreatePost;

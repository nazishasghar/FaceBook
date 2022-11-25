import { FunctionComponent, useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { resourceEndPoint } from "../../API/apiEndpoint";
import "./StoryComponent.css";
import Stories from "react-insta-stories";
interface StoryComponentProps {
  creatorImage: string;
  imageUrl: string;
  creatorName: string;
}

const StoryComponent: FunctionComponent<StoryComponentProps> = ({
  creatorImage,
  creatorName,
  imageUrl,
}) => {
  const [show, setStory] = useState(false);
  return (
    <div onClick={() => setStory(true)} className="story-component__container">
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
      >
        <Modal.Body style={{ padding: "0" }}>
          <Stories
            width={"100%"}
            stories={[
              {
                url: resourceEndPoint + `/${imageUrl}`,
                duration: 3000,
                header: {
                  heading: creatorName,
                  subheading: "Posted 30m ago",
                  profileImage: resourceEndPoint + `/${creatorImage}`,
                },
              },
            ]}
            onStoryEnd={() => setStory(false)}
            storyStyles={{ margin: "0" }}
          />
        </Modal.Body>
      </Modal>
      <div>
        <img
          className="story-component__creatorImage"
          src={resourceEndPoint + `/${creatorImage}`}
        ></img>
      </div>
      <div className="story-component__img">
        <img src={resourceEndPoint + `/${imageUrl}`}></img>
      </div>
    </div>
  );
};

export default StoryComponent;

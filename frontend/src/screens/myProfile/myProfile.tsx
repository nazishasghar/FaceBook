import "./myProfile.css";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resourceEndPoint } from "../../API/apiEndpoint";
import { Edit } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { updateUser } from "../../API/userApi";
import { AuthAction, FriendsAction } from "../../redux/reducer";
import { rejectRequest, sendRequest, unfriendUser } from "../../API/friendsAPI";
interface MyProfileProps {}

const MyProfile: FunctionComponent<MyProfileProps> = () => {
  const token = useSelector((state: any) => state.auth.token);
  const userId = useSelector((state: any) => state.auth.userId);
  let dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const profileRef = React.useRef<HTMLInputElement>(null);
  const ageRef = React.useRef<HTMLInputElement>(null);
  const addressRef = React.useRef<HTMLInputElement>(null);
  const pincodeRef = React.useRef<HTMLInputElement>(null);
  const maritalRef = React.useRef<HTMLInputElement>(null);
  const bloodGroupRef = React.useRef<HTMLInputElement>(null);
  const masterDegreeRef = React.useRef<HTMLInputElement>(null);
  const masterUniversityRef = React.useRef<HTMLInputElement>(null);
  const graduationDegreeRef = React.useRef<HTMLInputElement>(null);
  const graduationUniversityRef = React.useRef<HTMLInputElement>(null);
  const hobbieRef = React.useRef<HTMLInputElement>(null);
  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  const userData = useSelector((state: any) => state.auth.userData);
  const multimediaConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  };
  const tokenConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  let location = useLocation();
  let button;
  let isFriend;
  let isAlreadySentRequest;
  const friends = useSelector((state: any) => state.friends.friends);
  if (location.state) {
    if (friends.find((item) => item._id === location.state.item._id)) {
      button = (
        <Button
          onClick={() => {
            unfriendUser(userId, location.state.item._id, tokenConfig)
              .then((response) => {
                const id = response.data.removeUser;
                const updatedUser = response.data.currentUser;
                dispatch(FriendsAction.removeFriend({ id }));
                localStorage.setItem("userData", JSON.stringify(updatedUser));
              })
              .catch((err) => console.log(err));
          }}
          variant="primary"
        >
          unfriend
        </Button>
      );
    } else {
      if (
        userData.RequestSentTo.find((item) => item === location.state.item._id)
      ) {
        button = (
          <Button
            onClick={() => {
              rejectRequest(location.state.item._id, userId, tokenConfig)
                .then((response) => {
                  const id = response.data.removeSentRequestFromUser.id;
                  const userData = response.data.removeSentRequestFromUser;
                  dispatch(AuthAction.removeSentRequest({ id }));
                  localStorage.setItem("userData", JSON.stringify(userData));
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            variant="outline-primary"
          >
            Request Sent
          </Button>
        );
      } else {
        button = (
          <Button
            onClick={() => {
              sendRequest(location.state.item._id, userId, tokenConfig)
                .then((response) => {
                  const id = response.data.sendRequestToUser._id;
                  console.log(id);
                  const userData = response.data.getRequestFromUser;
                  dispatch(AuthAction.sendRequest({ id }));
                  localStorage.setItem("userData", JSON.stringify(userData));
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            variant="primary"
          >
            Send request
          </Button>
        );
      }
    }
  }

  return (
    <div className="myprofile-container">
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Change Profile</Form.Label>
              <Form.Control ref={profileRef} type="file" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control ref={ageRef} placeholder="Enter Age" required />
              <Form.Control.Feedback type="invalid">
                Please provide age.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                ref={addressRef}
                placeholder="Enter Address"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide address
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                ref={pincodeRef}
                placeholder="Enter Pincode"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide pincode.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Blood Group</Form.Label>
              <Form.Control
                ref={bloodGroupRef}
                placeholder="Enter Blood Group"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide blood group
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hobbies</Form.Label>
              <Form.Control
                ref={hobbieRef}
                placeholder="Enter Hobbies"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide Hobbies
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Marital Status</Form.Label>
              <Form.Control
                ref={maritalRef}
                placeholder="Enter Marital Status"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide Marital Status
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Masters</Form.Label>
              <Form.Control
                ref={masterDegreeRef}
                placeholder="Enter Degree"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a degree
              </Form.Control.Feedback>
              <Form.Control
                ref={masterUniversityRef}
                placeholder="Enter University"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a university
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Graduation</Form.Label>
              <Form.Control
                ref={graduationDegreeRef}
                placeholder="Enter Degree"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a degree
              </Form.Control.Feedback>
              <Form.Control
                ref={graduationUniversityRef}
                placeholder="Enter University"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a university
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            onClick={() => {
              let formData = new FormData();
              const Education = {
                Masters: {
                  Degree: masterDegreeRef.current.value,
                  University: masterUniversityRef.current.value,
                },
                Graduation: {
                  Degree: graduationDegreeRef.current.value,
                  University: graduationUniversityRef.current.value,
                },
              };
              formData.append("userId", userId);
              formData.append("Age", ageRef.current.value);
              formData.append("Address", addressRef.current.value);
              formData.append("Pincode", pincodeRef.current.value);
              formData.append("BloodGroup", bloodGroupRef.current.value);
              formData.append("Hobbies", hobbieRef.current.value);
              formData.append("MaritalStatus", maritalRef.current.value);
              formData.append("updatedProfilePic", profileRef.current.files[0]);
              formData.append("Education", JSON.stringify(Education));
              updateUser(formData, multimediaConfig)
                .then((response) => {
                  const { updatedUser } = response.data;
                  localStorage.setItem("userData", JSON.stringify(updatedUser));
                  dispatch(AuthAction.updateUser({ updatedUser }));
                  setShowModal(false);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="myprofile-container__main">
        <div className="myprofile-container__img">
          <img
            src={
              resourceEndPoint +
              `/${
                location.state
                  ? location.state.item.ProfilePic
                  : userData.ProfilePic
              }`
            }
          ></img>
          {!location.state && (
            <div
              onClick={() => setShowModal(true)}
              className="myprofile-container__edit"
            >
              <Edit />
            </div>
          )}
        </div>
        <div className="myprofile-container__name">
          <h2>{location.state ? location.state.item.Name : userData.Name}</h2>
          {location.state && button}
        </div>
        <div className="myprofile-container__infoContainer">
          <div className="myprofile-container__infoContainerOne">
            <div className="myprofile-container__infoContainerElement">
              <h3>Email</h3>
              <p>
                {location.state ? location.state.item.Email : userData.Email}
              </p>
            </div>
            <div className="myprofile-container__infoContainerElement">
              <h3>Age</h3>
              <p>{location.state ? location.state.item.Age : userData.Age}</p>
            </div>
            <div className="myprofile-container__infoContainerElement">
              <h3>Address</h3>
              <p>
                {location.state
                  ? location.state.item.Address +
                    ` -${location.state.item.Pincode}`
                  : userData.Address + ` -${userData.Pincode}`}
              </p>
            </div>
            <div className="myprofile-container__infoContainerElement">
              <h3>Blood Group</h3>
              <p>
                {location.state
                  ? location.state.item.BloodGroup
                  : userData.BloodGroup}
              </p>
            </div>
          </div>
          <div className="myprofile-container__infoContainerTwo">
            <div className="myprofile-container__infoContainerElement">
              <h3>Marital Status</h3>
              <p>
                {location.state
                  ? location.state.item.MaritalStatus
                  : userData.MaritalStatus}
              </p>
            </div>
            <div className="myprofile-container__infoContainerElement">
              <h3>Mobile Number</h3>
              <p>
                {location.state
                  ? location.state.item.MobileNumber
                  : userData.MobileNumber}
              </p>
            </div>
            <div className="myprofile-container__infoContainerElement">
              <h3>Education</h3>
              <div className="education-container">
                <div className="myprofile-container__infoContainerElement">
                  <h5>Masters</h5>
                  <p>
                    {location.state
                      ? location.state.item.Education.Masters.Degree
                      : userData.Education.Masters.Degree}
                  </p>
                  <p>
                    {location.state
                      ? location.state.item.Education.Masters.University
                      : userData.Education.Masters.University}
                  </p>
                </div>
                <div className="myprofile-container__infoContainerElement">
                  <h5>Graduation</h5>
                  <p>
                    {location.state
                      ? location.state.item.Education.Graduation.Degree
                      : userData.Education.Graduation.Degree}
                  </p>
                  <p>
                    {location.state
                      ? location.state.item.Education.Graduation.Univerisity
                      : userData.Education.Graduation.Univerisity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

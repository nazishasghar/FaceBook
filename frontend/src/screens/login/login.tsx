import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authEndPoint } from "../../API/apiEndpoint";
import {
  calculateExpirationTime,
  converhrTomill,
  getHr,
} from "../../helperFunction";
import RecentLogin from "../../components/recentLoginComponent/recentLoginComponent";
import { AuthAction } from "../../redux/reducer";
import "./login.css";
import { CancelOutlined, ImageOutlined } from "@mui/icons-material";
import { createAccount } from "../../API/authAPI";

const Login = () => {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const item: any = localStorage.getItem("userData");
  let userData = JSON.parse(item);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const token = useSelector((state: any) => state.auth.token);
  console.log(userData);
  const [showRecent, setShowRecent] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [file, setFile] = useState("");
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const ageRef = React.useRef<HTMLInputElement>(null);
  const addressRef = React.useRef<HTMLInputElement>(null);
  const pincodeRef = React.useRef<HTMLInputElement>(null);
  const mobileRef = React.useRef<HTMLInputElement>(null);
  const mastersDegreeRef = React.useRef<HTMLInputElement>(null);
  const mastersUniveristyRef = React.useRef<HTMLInputElement>(null);
  const graduationDegreeRef = React.useRef<HTMLInputElement>(null);
  const graduationUniversityRef = React.useRef<HTMLInputElement>(null);
  const hobbiesRef = React.useRef<HTMLInputElement>(null);
  const bloodRef = React.useRef<HTMLInputElement>(null);
  const maritalRef = React.useRef<HTMLInputElement>(null);
  const multimediaConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onLogin = (data: any) => {
    axios
      .post(authEndPoint + "/login", {
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        const userId = response.data.userId;
        const userData = response.data.user;
        const token = response.data.token;
        const messages = response.data.user.Messages;
        const hour = getHr(response.data.expiresIn);
        const time = converhrTomill(hour);
        const expirationTime = calculateExpirationTime(time);
        dispatch(
          AuthAction.login({
            userId,
            userData,
            token,
            expirationTime,
            messages,
          })
        );
        navigate("/home", { replace: true });
      })
      .catch((err) => console.log(err));
  };
  const [validated, setValidated] = useState(false);
  const [preview, setPreview] = useState(null);
  const handleChange = (e: any) => {
    setPreview(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    console.log(file);
  };
  const createAccountHandler = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    const Education = {
      Masters: {
        Degree: mastersDegreeRef.current.value,
        University: mastersUniveristyRef.current.value,
      },
      Graduation: {
        Degree: graduationDegreeRef.current.value,
        University: graduationUniversityRef.current.value,
      },
    };
    let formData = new FormData();
    formData.append("ProfilePic", file);
    formData.append("Name", nameRef.current.value);
    formData.append("Email", emailRef.current.value);
    formData.append("Password", passRef.current.value);
    formData.append("Age", ageRef.current.value);
    formData.append("Address", addressRef.current.value);
    formData.append("Pincode", pincodeRef.current.value);
    formData.append("MobileNumber", mobileRef.current.value);
    formData.append("Education", JSON.stringify(Education));
    formData.append("Hobbies", hobbiesRef.current.value);
    formData.append("BloodGroup", bloodRef.current.value);
    formData.append("MaritalStatus", maritalRef.current.value);
    createAccount(formData, multimediaConfig)
      .then((_response) => {
        setValidated(true);
        setShowCreateAccount(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onRecentLogin = () => {
    axios
      .post(authEndPoint + "/login", {
        email: userData.Email,
        password: passwordRef.current?.value,
      })
      .then((response) => {
        const userId = response.data.userId;
        const userData = response.data.user;
        const token = response.data.token;
        const messages = response.data.user.Messages;
        const hour = getHr(response.data.expiresIn);
        const time = converhrTomill(hour);
        const expirationTime = calculateExpirationTime(time);
        dispatch(
          AuthAction.login({
            userId,
            userData,
            token,
            expirationTime,
            messages,
          })
        );
        navigate("/home", { replace: true });
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="login-container">
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showRecent}
        onHide={() => setShowRecent(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="recentLogin-Container__profile">
            {userData && (
              <img
                src={`http://localhost:3004/public/${userData.ProfilePic}`}
              ></img>
            )}
          </div>
          <Form onSubmit={handleSubmit(onRecentLogin)}>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                ref={passwordRef}
              />
            </Form.Group>
            <Button
              onClick={onRecentLogin}
              style={{ width: "100%" }}
              variant="primary"
            >
              Login
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="login-container__recentLoginContainer">
        <div className="login-container__logo">
          <img src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg"></img>
          {userData && (
            <>
              <h3>Recent logins</h3>
              <p>Click your picture or add an account.</p>
              <div onClick={() => setShowRecent(true)}>
                <RecentLogin />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="login-container__form">
        <div className="login-container__loginFormContainer">
          <Form onSubmit={handleSubmit(onLogin)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                {...register("email", { required: true })}
                type="email"
                placeholder="Enter email"
              />
              {errors.email && (
                <p style={{ color: "red" }}>This field is required</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...register("password", { required: true })}
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <p style={{ color: "red" }}>This field is required</p>
              )}
            </Form.Group>
            <Button
              style={{ width: "100%", fontWeight: "bold" }}
              variant="primary"
              type="submit"
            >
              Login
            </Button>
            <div className="login-container__seperator"></div>
            <div style={{ textAlign: "center" }}>
              <Button
                onClick={() => setShowCreateAccount(true)}
                className="create-account"
                variant="primary"
              >
                Create Accout
              </Button>
            </div>
            <Modal
              show={showCreateAccount}
              onHide={() => setShowCreateAccount(false)}
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Sign Up
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form noValidate validated={validated}>
                  <div className="create-account__img">
                    {!preview ? (
                      <>
                        <label htmlFor="profile-pic">
                          <ImageOutlined sx={{ fontSize: "15rem" }} />
                        </label>
                        <input
                          style={{ display: "none" }}
                          onChange={handleChange}
                          type="file"
                          id="profile-pic"
                        ></input>
                      </>
                    ) : (
                      <div className="profileImage">
                        <div
                          onClick={() => setPreview(null)}
                          className="cancel-button"
                        >
                          <CancelOutlined />
                        </div>
                        <img src={preview}></img>
                      </div>
                    )}
                  </div>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      ref={emailRef}
                      type="email"
                      placeholder="Enter email"
                      required
                    />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      Please provide a email
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      ref={passRef}
                      type="password"
                      placeholder="Password"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid password
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      ref={nameRef}
                      placeholder="Enter Name"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a name
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      ref={ageRef}
                      placeholder="Enter Age"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide an age
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      ref={addressRef}
                      placeholder="Enter address"
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
                      Please provide pincode
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      ref={mobileRef}
                      placeholder="Enter Mobile Number"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide mobile number
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Education</Form.Label>
                    <Form.Control
                      ref={mastersDegreeRef}
                      placeholder="Enter Master Degree"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide masters degree
                    </Form.Control.Feedback>
                    <Form.Control
                      ref={mastersUniveristyRef}
                      placeholder="Enter Master University"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide masters university
                    </Form.Control.Feedback>
                    <Form.Control
                      ref={graduationDegreeRef}
                      placeholder="Enter Graduation Degree"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide graduation degree
                    </Form.Control.Feedback>
                    <Form.Control
                      ref={graduationUniversityRef}
                      placeholder="Enter Graduation University"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide graduation university
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Hobbies</Form.Label>
                    <Form.Control
                      ref={hobbiesRef}
                      placeholder="Enter Hobbies"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide your hobbies
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Blood Group</Form.Label>
                    <Form.Control
                      ref={bloodRef}
                      placeholder="Enter Blood Group"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide blood group
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
                      Please provide your marital status
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button onClick={createAccountHandler} variant="primary">
                    Create
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Login;

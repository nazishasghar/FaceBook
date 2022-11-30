import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "./recentLoginComponent.css";
const RecentLogin = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  return (
    <div className="recentLogin-container">
      <div className="recentLogin-container__profileImage">
        <img
          src={
            userData
              ? `http://localhost:3004/public/${userData.ProfilePic}`
              : "https://scontent.fdel3-4.fna.fbcdn.net/v/t39.30808-1/293569392_158959356679713_7087147635261538384_n.jpg?stp=dst-jpg_p240x240&_nc_cat=104&ccb=1-7&_nc_sid=dbb9e7&_nc_ohc=c3CZyKvwNpEAX8095Yz&_nc_ht=scontent.fdel3-4.fna&oh=00_AfBk6QsiwM3wv-LCeieMTMzke_J1Bv3qvnULcYtg6z7ciA&oe=6381B7DC"
          }
        ></img>
      </div>
      <div className="recentLogin-container__Name">
        <h5>{userData ? userData.Name : "Nazish Asghar"}</h5>
      </div>
    </div>
  );
};

export default RecentLogin;

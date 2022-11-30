import { useSelector } from "react-redux";
import FriendComponent from "../../components/friendComponent/friendComponent";
import { RootState } from "../../redux/store";
import "./friends.css";
const Friend = () => {
  const friends = useSelector((state: RootState) => state.friends.friends);
  return (
    <div className="friend-screen__container">
      <div className="friend-screen__element">
        {friends.length > 0 ? (
          friends.map((item) => {
            return (
              <FriendComponent
                item={item}
                friend={true}
                imageUrl={item.ProfilePic}
                name={item.Name}
                status={item.isOnline}
              />
            );
          })
        ) : (
          <h1 className="friends-error">No Friends, Why so lonely ??</h1>
        )}
      </div>
    </div>
  );
};
export default Friend;

import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { searchUser } from "../../API/userApi";
import FriendComponent from "../../components/friendComponent/friendComponent";
import "./search.css";

interface SearchProps {}

const Search: FunctionComponent<SearchProps> = () => {
  const userId = useSelector((state: any) => state.auth.userId);
  const [searchResult, setSearchResults] = useState([]);
  const [queryText, setQueryText] = useState("");
  useEffect(() => {
    if (!queryText) {
      setSearchResults([]);
      return;
    } else {
      searchUser(queryText)
        .then((response) => {
          const results = response.data;
          setSearchResults(results);
        })
        .catch((err) => console.log(err));
    }
  }, [queryText]);
  return (
    <div className="search-screenContainer">
      <div className="search-screenContent">
        <div className="search-screen__searchField">
          <input
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search User"
          ></input>
        </div>
        <div className="search-screen__searchResult">
          {searchResult.map((item) => {
            if (item._id !== userId) {
              return (
                <div className="search-screen__searchResultElement">
                  <FriendComponent
                    imageUrl={item.ProfilePic}
                    name={item.Name}
                    status={item.isOnline}
                    friend={true}
                    item={item}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Search;

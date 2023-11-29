import React from "react";
import UserSearchItem from "@components/UserSearchItem";

const SearchedUser = ({ email, username, profile, accessChat, userId }) => {
  return (
    <div onClick={() => accessChat(userId)}>
      <UserSearchItem email={email} username={username} profile={profile} />
    </div>
  );
};

export default SearchedUser;

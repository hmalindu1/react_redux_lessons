import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";

import React from "react";

const PostAuthor = ({ userId }) => {
  const users = useSelector(selectAllUsers);

  console.log("users", users);
  console.log("userId", userId);

  const author = users.find((user) => user.id === userId);
  console.log("author", author);

  return <span>{author ? author.name : "Unknown author"}</span>;
};

export default PostAuthor;

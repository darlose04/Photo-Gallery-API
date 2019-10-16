const User = require("../models/User");

// const initialUsers = [
//   {
//     name: "John Doe",
//     email: "jdoe@gmail.com",
//     password: "123456"
//   }
// ];

const usersInDb = async () => {
  const users = await User.find({});
  return users;
};

module.exports = {
  // initialUsers,
  usersInDb
};

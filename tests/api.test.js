const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./helper");
const User = require("../models/User");

describe("check that routes are returning as expected", () => {
  test("landing page at root route is returned successfully", async () => {
    await api.get("/").expect(200);
  });

  test("dashboard page returned successfully", async () => {
    await api.get("/dashboard").expect(302);
  });

  test("login page returned successfully", async () => {
    await api.get("/users/login").expect(200);
  });

  test("register page returned successfully", async () => {
    await api.get("/users/register").expect(200);
  });

  test("logout page is found or returned successfully", async () => {
    await api.get("/users/logout").expect(302);
  });
});

describe("testing users in the db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({
      name: "John Doe",
      email: "jdoe@gmail.com",
      password: "123456"
    });
    await user.save();
  });

  test("number of users in the db", async () => {
    const numOfUsers = await helper.usersInDb();

    expect(numOfUsers.length).toBe(1);
  });

  test("creating a new user", async () => {
    await User.deleteMany({});
    const usersAtStart = await helper.usersInDb();

    const newUser = new User({
      name: "Joe",
      email: "joe@gmail.com",
      password: "123456"
    });

    await newUser.save();

    const usersAtEnd = await helper.usersInDb();
    console.log(usersAtEnd);
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const emails = usersAtEnd.map(user => user.email);
    expect(emails).toContain(newUser.email);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./helper");
const User = require("../models/User");

// beforeEach(async () => {
//   await User.deleteMany({});

//   const userObjects = helper.
// })

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

// mongoose.connection.close();

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
// use helper here if needed

// require schema here

// test("landing page at root route is returned successfully", async () => {
//   await api.get("/").expect(200);
// });

test("login page returned successfully", async () => {
  await api.get("/users/login").expect(200);
});

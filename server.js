const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const db = require("./data/dbConfig.js");
const restricted = require("./auth/restricted-middleware.js");

const server = express();

//import routers here
const authRouter = require("./auth/auth-router.js");

server.use(helmet());
server.use(express.json());
server.use(cors());

//use routers here
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.send("server is workin aiiight");
});

//get all users
//restrict access to endpoint
// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.

server.get("/api/users", restricted, only("olympia"), (req, res) => {
  db("users")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json(error));
});

function only(name) {
  return function(req, res, next) {
    if (req.headers.name.toUpperCase() === name.toUpperCase()) {
      next();
    } else {
      res.status(403).json({ message: "You are not olympia" });
    }
  };
}

module.exports = server;

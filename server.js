const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

//dbConfig import
const db = require("./data/dbConfig.js");
const restricted = require("./auth/restricted-middleware.js");

const server = express();

const sessionConfig = {
  name: "monster",
  secret: "Keep it secret and safe",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: db,
    tablename: "sessions",
    sidfieldname: "sid",
    createTable: true,
    clearIntervale: 1000 * 60 * 30 //delete expired sessions
  })
};

//import routers here
const authRouter = require("./auth/auth-router.js");
const usersRouter = require("./users/users-router.js");

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

//use routers here
server.use("/api/auth", authRouter);
server.use("/api", usersRouter);

server.get("/", (req, res) => {
  res.send("server is workin aiiight");
});

//get all users
//restrict access to endpoint
// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.

server.get("/api/users", restricted, (req, res) => {
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

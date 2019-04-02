const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./data/dbConfig.js");

const server = express();

//import routers here

server.use(helmet());
server.use(express.json());
server.use(cors());

//use routers here

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

function restricted(req, res, next) {
  const { name, password } = req.headers; //grabs

  if (name && password) {
    db("users")
      .where({ name })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "You cannot pass!!" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ message: "Please provide credentials" });
  }
}

function only(name) {
  return function(req, res, next) {
    if (req.headers.name.toUpperCase() === name.toUpperCase()) {
      next();
    } else {
      res.status(403).json({ message: "You are not olympia" });
    }
  };
}

//register new username and password
server.post("/api/register", (req, res) => {
  let user = req.body;
  console.log(user);
  // //hash the password
  const hash = bcrypt.hashSync(user.password, 4);
  user.password = hash;
  //post user
  db("users")
    .insert(user)
    .then(ids => {
      console.log(ids);
      const id = ids[0];
      db("users")
        .where({ user_id: id })
        .then(ids => res.status(201).json(ids));
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//login using user name and password
server.post("/api/login", (req, res) => {
  let { name, password } = req.body;
  console.log(name, password);
  db("users")
    .where({ name })
    .first()
    .then(user => {
      //check password against db
      console.log(user);
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.name}` });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = server;

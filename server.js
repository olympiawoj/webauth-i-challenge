const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const server = express();

//import routers here

server.use(helmet());
server.use(express.json());
server.use(cors());
//use routers here

server.get("/", (req, res) => {
  res.send("server is workin aiiight");
});

server.post("/api/register", (req, res) => {
  let user = req.body;
});

module.exports = server;

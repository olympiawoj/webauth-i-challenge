const express = require("express");
const server = express();

//import routers here

server.use(express.json());

//use routers here

server.get("/", (req, res) => {
  res.send("server is workin aiiight");
});

module.exports = server;

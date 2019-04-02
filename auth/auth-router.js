const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../data/dbConfig.js");

//register new username and password
router.post("/register", (req, res) => {
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
router.post("/login", (req, res) => {
  let { name, password } = req.body;
  console.log(name, password);
  db("users")
    .where({ name })
    .first()
    .then(user => {
      //check password against db
      console.log(user);
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.name}` });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;

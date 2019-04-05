// const bcrypt = require("bcryptjs");
// const db = require("../data/dbConfig.js");

function restricted(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }

  //   const { name, password } = req.headers; //grabs
  //   if (name && password) {
  //     db("users")
  //       .where({ name })
  //       .first()
  //       .then(user => {
  //         if (user && bcrypt.compareSync(password, user.password)) {
  //           next();
  //         } else {
  //           res.status(401).json({ message: "You cannot pass!!" });
  //         }
  //       })
  //       .catch(error => {
  //         res.status(500).json(error);
  //       });
  //   } else {
  //     res.status(401).json({ message: "Please provide credentials" });
  //   }
}

module.exports = restricted;

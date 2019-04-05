const router = require("express").Router();
const db = require("../data/dbConfig.js");
const Users = require("../users/users-model.js");
const restricted = require("../auth/restricted-middleware.js");

//get all users
//restrict access to endpoint
// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.

//GET USERS: THEN & CATCH
// router.get("/users", restricted, (req, res) => {
//   Users.find()
//     .then(users => {
//       console.log(users);
//       res.status(200).json(users);
//     })
//     .catch(err => {
//       console.log(err);
//       res
//         .status(500)
//         .json({ message: "Invalid credentials while trying to see users" });
//     });
// });

//GET USERS: AWAIT & ASYNC
router.get("/users", restricted, async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Invalid credentials while trying to see users" });
  }
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

module.exports = router;

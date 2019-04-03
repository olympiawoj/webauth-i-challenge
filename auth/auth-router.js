const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model.js");

//REGISTER: THEN & CATCH
// router.post("/register", (req, res) => {
//   let user = req.body;
//   console.log(user);
//   // //hash the password
//   const hash = bcrypt.hashSync(user.password, 4);
//   user.password = hash;
//   //post user
//   Users.add(user)
//     .then(saved => {
//       console.log(saved);
//       res.status(201).json(saved);
//     })
//     .catch(error => {
//       res.status(500).json(error);
//     });
// });

//REGISTER: ASYNC AWAIT TRY & CATCH
router.post("/register", async (req, res) => {
  let user = req.body;
  console.log(user);
  // //hash the password
  const hash = bcrypt.hashSync(user.password, 4);
  user.password = hash;
  //post user

  try {
    const saved = await Users.add(user);
    console.log(user);
    res.status(201).json(saved);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//LOGIN: THEN & CATCH
router.post("/login", (req, res) => {
  let { name, password } = req.body;
  console.log(name, password);

  Users.findBy({ name })
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

//LOGIN: ASYNC & AWAIT

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).json({ message: "you have an error logging out" });
    } else {
      res.status(200).json({ message: "bye thanks for visiting" });
    }
  });
});

module.exports = router;

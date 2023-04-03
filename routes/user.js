const { Router } = require("express");
const router = Router();
const uuid = require("uuid-random");
const Datastore = require("nedb");

const db = new Datastore({ filename: "users.db", autoload: true });

const user = {
  username: "oscarmat",
  password: "password123",
};

db.insert(user, (err, newDoc) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Inserted user:", newDoc);
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.find({ username, password }, (err, users) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    } else if (users.length === 0) {
      res.status(401).send("Invalid username or password");
    } else {
      const user = users[0];
      res.send(`Welcome ${user.username}`);
    }
  });
});

module.exports = router;

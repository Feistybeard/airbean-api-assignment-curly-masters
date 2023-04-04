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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await db.find({ username, password });
    if (users.length === 0) {
      res.status(401).send("Invalid username or password");
    } else {
      const user = users[0];
      res.send(`Welcome ${user.username}`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;

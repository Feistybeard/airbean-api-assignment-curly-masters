const { Router } = require("express");
const router = Router();
const uuid = require("uuid-random");
const Datastore = require("nedb-promises");
const session = require("express-session");

const db = new Datastore({ filename: "users.db", autoload: true });

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (username === undefined || password === undefined) {
    return res.status(400).json({ message: "Ett fel uppstod, försök igen!" });
  }

  let errors = [];
  if (!username || !password) {
    errors.push({ message: "Fyll i alla fält" });
  }
  if (username.length < 3) {
    errors.push({ message: "Användarnamnet måste vara minst 3 tecken" });
  }
  if (password.length < 6) {
    errors.push({ message: "Lösenordet måste vara minst 6 tecken" });
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  } else {
    const user = {
      _id: uuid(),
      username,
      password,
    };
    const userExists = await db.findOne({ username: user.username });

    if (userExists) {
      return res.status(400).json({ message: "Användarnamnet används redan!" });
    } else {
      const newUser = await db.insert(user);

      if (!newUser || newUser === undefined) {
        return res
          .status(500)
          .json({ message: "Ett fel uppstod, försök igen!" });
      }
      return res.status(200).json({ success: true });
    }
  }
});

router.get("/signup", (req, res) => {
  res.status(200).json({ message: "Vad gör du här?" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await db.find({ username, password });
    if (users.length === 0) {
      res.status(401).send("Invalid username or password");
    } else {
      const user = users[0];
      req.session.user = user;
      res.send(`Welcome ${user.username}`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;

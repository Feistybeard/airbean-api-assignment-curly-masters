const { Router } = require("express");
const router = Router();
const uuid = require("uuid-random");
const db = require("../utils/db");

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

    const userExists = await db.users.findOne({ username: user.username });
    if (userExists) {
      return res.status(400).json({ message: "Användarnamnet används redan!" });
    } else {
      const newUser = await db.users.insert(user);

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
    const users = await db.users.find({ username, password });
    if (users.length === 0) {
      res.status(401).send("Felaktigt användarnamn eller lösenord");
    } else {
      const user = users[0];
      req.session.user = user;
      res.send(`Welcome ${user.username}`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Ett fel inträffade");
  }
});

router.get("/history", async (req, res) => {
  if (req.session.user === undefined) {
    return res.status(401).json({
      success: false,
      message: "Du måste vara inloggad för att se din orderhistorik!",
    });
  } else {
    const orders = await db.orders.find({ belongsTo: req.session.user._id });
    if (orders.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Du har inga tidigare beställningar!",
      });
    }

    let orderHistory = [];
    for (let i = 0; i < orders.length; i++) {
      const orderTotalPrice = orders[i].details.order.reduce(
        (acc, item) => acc + item.price,
        0
      );

      const order = {
        total: orderTotalPrice,
        orderNr: orders[i].orderNr,
        orderDate: orders[i].orderDate,
      };
      orderHistory.push(order);
    }

    return res.status(200).json({ sucess: true, orderHistory });
  }
});

module.exports = router;

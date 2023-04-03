const { Router } = require("express");
const router = Router();
const uuid = require("uuid-random");
const Datastore = require("nedb");

const db = new Datastore({ filename: "orders.db", autoload: true });

router.post("/order", (req, res) => {
  const { name, price } = req.body;
  const order = {
    id: uuid(),
    name,
    price,
    date: new Date(),
  };
  db.insert(order, (err, newOrder) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    } else {
      res.send(`Order ${newOrder.id} created`);
    }
  });
});

router.get("/orders", (req, res) => {
  db.find({}, (err, orders) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    } else {
      res.send(orders);
    }
  });
});

module.exports = router;

const { Router } = require("express");
const router = Router();
const uuid = require("uuid-random");
const Datastore = require("nedb-promises");
const db = new Datastore({ filename: "orders.db", autoload: true });

// const order = {
//   orderId: "123",
//   eta: 10,
// };

// db.insert(order);

router.get("/order/status/:id", async (req, res) => {
  const { id } = req.params;

  const getOrder = await db.findOne({ orderId: id });
  if (getOrder) {
    res.json({ eta: getOrder.eta });
  } else {
    res
      .status(200)
      .json({ success: false, message: "Ingen beställning funnen" });

const coffeeMenuJson = require("../menu.json");

const menu = coffeeMenuJson.menu;
router.get("/", (req, res) => {
  res.json({ success: true, menu });

router.post("/order", async (req, res) => {
  const { name, price } = req.body;
  const order = {
    id: uuid(),
    name,
    price,
    date: new Date(),
  };
  try {
    const newOrder = await new Promise((resolve, reject) => {
      db.insert(order, (err, newDoc) => {
        if (err) {
          reject(err);
        } else {
          resolve(newDoc);
        }
      });
    });
    res.send(`Order ${newOrder.id} created`);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await new Promise((resolve, reject) => {
      db.find({}, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
    res.send(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;

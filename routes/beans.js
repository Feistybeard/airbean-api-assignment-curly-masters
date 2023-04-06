const { Router } = require("express");
const router = Router();
const uuid = require("uuid-random");
const db = require("../utils/db");
const middleWare = require("../middleware/index");
const coffeeMenuJson = require("../menu.json");

router.get("/order/status/:id", async (req, res) => {
  const { id } = req.params;

  const getOrder = await db.orders.findOne({ _id: id });
  if (getOrder) {
    res.json({ eta: getOrder.eta });
  } else {
    res
      .status(200)
      .json({ success: false, message: "Ingen beställning funnen" });
  }
});

router.get("/", middleWare.testing, function (req, res) {
  const menu = coffeeMenuJson.menu;
  res.json({ success: true, menu });
});

router.post("/order", middleWare.isValidProducts, async function (req, res) {
  const { ...order } = req.body;

  if (order === undefined) {
    return res.status(400).json({ message: "Ett fel uppstod, försök igen!" });
  }

  let orderToInsert = {};
  if (req.session.user === undefined) {
    orderToInsert = {
      belongsTo: uuid(),
      orderNr: uuid(),
      orderDate: new Date().toLocaleDateString("sv-SE"),
      ...order,
    };
  } else {
    orderToInsert = {
      belongsTo: req.session.user._id,
      orderNr: uuid(),
      orderDate: new Date().toLocaleDateString("sv-SE"),
      ...order,
    };
  }
  const newOrder = await db.orders.insert(orderToInsert);
  orderToInsert = {};
  return res.status(200).json({ success: true });
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
    res.status(500).send("Ett fel inträffade");
  }
});

module.exports = router;

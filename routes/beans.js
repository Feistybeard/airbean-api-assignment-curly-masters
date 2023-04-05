const { Router } = require("express");
const router = Router();
const uuid = require("uuid-random");
const db = require("../middleware/index");

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

const coffeeMenuJson = require("../menu.json");

const menu = coffeeMenuJson.menu;
router.get("/", (req, res) => {
  res.json({ success: true, menu });
});

router.post("/order", async (req, res) => {
  const { ...order } = req.body;

  if (order === undefined) {
    return res.status(400).json({ message: "Ett fel uppstod, försök igen!" });
  }

  function checkItems(order) {
    let foundItems = 0;
    let errors = [];
    for (let i = 0; i < order.details.order.length; i++) {
      for (let j = 0; j < menu.length; j++) {
        if (order.details.order[i].name !== menu[j].title) {
        } else {
          if (order.details.order[i].price !== menu[j].price) {
            errors.push({ message: "Fuska inte med priserna!" });
            return errors;
          } else {
            foundItems++;
          }
        }
      }
    }
    if (foundItems === order.details.order.length) {
      return errors;
    } else {
      errors.push({
        message:
          "Måste vara en av följande produkter: Bryggkaffe, Caffè Doppio, Cappuccino, Latte Macchiato, Kaffe Latte, Cortado",
      });
      return errors;
    }
  }

  const checkedOrder = checkItems(order);

  if (checkedOrder.length > 0) {
    return res.status(400).json({ errors: checkedOrder });
  } else {
    // show only the month, day, and year
    // let orderDate = new Date("2020-01-01");

    let order2 = {};
    if (req.session.user === undefined) {
      order2 = {
        belongsTo: uuid(),
        orderNr: uuid(),
        orderDate: new Date(2020, 01, 01),
        ...order,
      };
    } else {
      order2 = {
        belongsTo: req.session.user._id,
        orderNr: uuid(),
        orderDate: new Date(2020, 01, 01),
        ...order,
      };
    }
    const newOrder = await db.orders.insert(order2);
    order2 = {};
    return res.status(200).json({ success: true });
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
    res.status(500).send("Ett fel inträffade");
  }
});

module.exports = router;

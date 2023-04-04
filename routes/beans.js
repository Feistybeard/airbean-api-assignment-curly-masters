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

  const getOrder = await db.findOne({ _id: id });
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
    let order2 = {};
    if (req.session.user === undefined) {
      order2 = {
        belongsTo: uuid(),
        _id: uuid(),
        ...order,
      };
    } else {
      order2 = {
        belongsTo: req.session.user._id,
        _id: uuid(),
        ...order,
      };
    }
    const newOrder = await db.insert(order2);
    order2 = {};
    return res.status(200).json({ success: true });
  }

  // const newOrder2 = await ((resolve, reject) => {
  //   db.insert(order2, (err, newOrder) => {
  //     if (err) {
  //       reject(err);
  //     } else {
  //       resolve(newOrder);
  //     }
  //   });
  // });
  // resolve.send(`Order ${newOrder2._id} created`);

  // try {
  //   const newOrder = await new Promise((resolve, reject) => {
  //     db.insert(order2, (err, newOrder) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(newOrder);
  //       }
  //     });
  //   });
  //   resolve.send(`Order ${newOrder._id} created`);
  // } catch (err) {
  //   console.log("test");
  //   console.error(err);
  //   resolve.status(500).send("An error occurred");
  // }
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

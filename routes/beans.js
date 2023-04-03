const { Router } = require("express");
const router = Router();
const uuid = require("uuid-random");
const Datastore = require("nedb-promises");

const ordersDb = Datastore.create({ filename: "beans.db", autoload: true });

// const order = {
//   orderId: "123",
//   eta: 10,
// };

// ordersDb.insert(order);

router.get("/order/status/:id", async (req, res) => {
  const { id } = req.params;

  const getOrder = await ordersDb.findOne({ orderId: id });
  if (getOrder) {
    res.json({ eta: getOrder.eta });
  } else {
    res
      .status(200)
      .json({ success: false, message: "Ingen beställning funnen" });
  }
});

module.exports = router;

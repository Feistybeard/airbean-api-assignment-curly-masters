const menu = require("../menu.json");

function isValidProducts(req, res, next) {
  const { ...products } = req.body;

  for (const product of products.details.order) {
    let menuProduct = menu.menu.find((p) => p.title === product.name);
    if (!menuProduct) {
      return res.status(400).json({
        error:
          "Måste vara en av följande produkter: Bryggkaffe, Caffè Doppio, Cappuccino, Latte Macchiato, Kaffe Latte, Cortado",
      });
    }

    if (menuProduct.price !== product.price) {
      return res.status(400).json({ error: "Fuska inte med priserna!" });
    }
  }

  next();
}

function testing(req, res, next) {
  console.log("test");
  next();
}

module.exports = { isValidProducts, testing };

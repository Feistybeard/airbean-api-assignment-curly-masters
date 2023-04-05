const menu = require("./menu.json");

function isValidProduct(req, res, next) {
  const product = req.body.product;

  const menuProduct = menu.menu.find((p) => p.id === product.id);
  if (!menuProduct) {
    return res.status(400).json({ error: "Ogiltig produkt" });
  }

  if (menuProduct.price !== product.price) {
    return res.status(400).json({ error: "Ogiltig pris" });
  }

  next();
}

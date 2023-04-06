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

function isValidBody(req, res, next) {
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
    next();
  }
}

module.exports = { isValidProducts, isValidBody };

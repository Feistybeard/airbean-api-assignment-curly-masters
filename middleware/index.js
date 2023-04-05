const Datastore = require("nedb-promises");

db = {};
db.users = new Datastore({ filename: "users.db", autoload: true });
db.orders = new Datastore({ filename: "orders.db", autoload: true });

module.exports = db;

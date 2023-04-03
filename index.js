const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

const beansRouter = require("./routes/beans");
const userRouter = require("./routes/user");

app.use(express.json());

app.use("/api/beans", beansRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log("Server started");
});

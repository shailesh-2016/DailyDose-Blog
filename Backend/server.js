const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const db = require("./config/db");
db();
const PORT = process.env.PORT || 3000;

////route
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");

///use
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/image", express.static("uploads"));

///api
app.use("/api/user", userRoute);
app.use("/api/blog", blogRoute);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));

require("dotenv").config();

const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const allroutes = require("./routes/allroutes.route");

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Database Connected");
});

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.use("/api", allroutes);


app.listen(process.env.PORT, () => {
    console.log("Server Start port on " + process.env.PORT);
})
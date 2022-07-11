require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const allroutes = require("./routes/allroutes.route");

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Database Connected");
});

app.use("/api", allroutes);


app.listen(process.env.PORT, () => {
    console.log("Server Start port on " + process.env.PORT);
})
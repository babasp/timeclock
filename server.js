const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const employeeRoutes = require("./routes/employeeRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

dotenv.config({ path: "./config.env" });
if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

app.use("/", employeeRoutes);
app.use("/admin", adminRoutes);

app.all("*", (req, res) => {
  res.render("404");
});

//connect mongoDB
const DB = process.env.MONGO_URI.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connect successfully"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));

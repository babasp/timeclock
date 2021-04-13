const express = require("express");
const morgan = require("morgan");
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));

require("dotenv").config({
  path: [".env.development.local", ".env"],
});

const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3333;

const corsOptions = {
  origin: true, // or ["http://localhost:5173", "https://example.com"]
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("tiny"));

app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);
app.use("/api", routes);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).send({ message: error.message });
  } else if (error.code === "INVALID_FILE_TYPE") {
    return res.status(400).send({
      message: "Invalid file type. Only JPEG and PNG are allowed.",
    });
  } else {
    console.error(error.stack);
    return res.status(500).send({ message: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

module.exports = app;

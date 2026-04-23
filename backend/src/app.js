const express = require("express");
const cors = require("cors");
const passport = require("passport");

const { AppError } = require("./utils/appError");
const traceId = require("./middleware/traceId");
const errorHandler = require("./middleware/errorHandler");
const configurePassport = require("./config/passport");

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin:
      corsOrigins.length > 0
        ? corsOrigins
        : ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);
app.use(traceId);
app.use(express.json());

configurePassport(passport);
app.use(passport.initialize());

app.use("/v1/api", require("./routes/index"));

app.use((req, res, next) => {
  next(new AppError({ status: 404, code: "NOT_FOUND", message: "Route not found" }));
});

app.use(errorHandler);

module.exports = app;

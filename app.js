const express = require("express");
const ExpressError = require("./expressError");
const dotenv = require('dotenv');
const slugify = require('slugify');

const bodyParser = require("body-parser");

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.use(express.json());

const compRoutes = require("./routes/companies");
app.use("/companies", compRoutes);

const invRoutes = require("./routes/invoices");
app.use("/invoices", invRoutes);

const indRoutes = require("./routes/industries");
app.use("/industries", indRoutes);



app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);
  
    // pass err to the next middleware
    return next(err);
  });
  
  /** general error handler */
  
  app.use(function (err, req, res, next) {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
  
    // set the status and alert the user
    return res.status(status).json({
      error: {
        message: err.message,
        status: status
      }
    });
  });



module.exports = app;
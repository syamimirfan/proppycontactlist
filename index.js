// Require necessary modules
const express = require('express');
// Create an Express application
const app = express();
const bodyParser = require('body-parser');
// CORS
const cors = require('cors');
//call database
const db = require('./config/db')
require('dotenv').config();

app.use(cors({
    origin: "*",
}))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route handler
app.use("/", require("./api/contact"));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => { 
  console.log(`Server is running on port ${port}`); 
}); 
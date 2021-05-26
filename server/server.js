require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const db = require("./db");

// middleware //
app.use(cors())
app.use(express.json())
const express = require("express");
const cors = require("cors");
const emailRoutes = require("./routes/emailRoutes");
require("dotenv").config();
require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the routes
app.use("/api", emailRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

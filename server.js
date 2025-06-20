const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/jobs", require("./routes/jobs"));
app.use("/mustHave", require("./routes/mustHave"));
app.use("/niceToHave", require("./routes/niceToHave"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

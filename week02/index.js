const express = require("express");
const app = express();
const PORT = 3000;

// Serve static files from public directory
app.use(express.static("public"));

// test endpoint
app.get("/hello", (req, res) => {
  res.send("Hello from the server!");
});

app.get("/add", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);

  if (isNaN(num1) || isNaN(num2)) {
    return res
      .status(400)
      .json({ error: "Both num1 and num2 must be valid numbers" });
  }

  const sum = num1 + num2;
  res.json({ num1, num2, sum });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

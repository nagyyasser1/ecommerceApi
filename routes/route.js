const router = require("express").Router();
const path = require("path");

// `^/$`: Matches the root path ("/").
// `|`: Acts as an OR operator.
// `/index(.html)?`: Matches "/index" with or without a trailing ".html".

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;

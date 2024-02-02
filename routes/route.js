import { Router } from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

// `^/$`: Matches the root path ("/").
// `|`: Acts as an OR operator.
// `/index(.html)?`: Matches "/index" with or without a trailing ".html".

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(join(__dirname, "..", "views", "index.html"));
});

export default router;

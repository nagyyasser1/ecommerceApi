import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const notFound = (req, res, next) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(join(__dirname, "../views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "Page Not Found!" });
  } else {
    res.type("txt").send("404 Not Found!");
  }
}; 

export default notFound;

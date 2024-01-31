import { Router } from 'express';
import { join } from 'path';

const router = Router();

// `^/$`: Matches the root path ("/").
// `|`: Acts as an OR operator.
// `/index(.html)?`: Matches "/index" with or without a trailing ".html".

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(join(__dirname, '..', 'views', 'index.html'));
});

export default router;

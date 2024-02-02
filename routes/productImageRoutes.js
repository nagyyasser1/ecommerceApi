import { Router } from "express";
import {
  addImages,
  deleteImage,
} from "../controllers/productImagesController.js";
import isAdmin from "../middlewares/isAdmin.js";

import fileUpload from "express-fileupload";
import filePayloadExists from "../middlewares/filesPayloadExists.js";
import fileSizeLimiter from "../middlewares/fileSizeLimiter.js";
import fileExtLimiter from "../middlewares/fileExtLimiter.js";

const router = Router();

router.delete(
  "/", //isAdmin,
  deleteImage
);

router.post(
  "/:productId",
  // isAdmin,
  fileUpload({ createParentPath: true }),
  filePayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  addImages
);

export default router;

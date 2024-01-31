import { getAllSizes, addSize, updateSize, deleteSize } from '../controllers/sizeController.js';
import isAdmin from "../middlewares/isAdmin.js";
import { validateNewSizeData } from "../utils/validations/size.validations.js";
import { Router } from 'express';
const router = Router();

router.use(isAdmin);

router.get("/", getAllSizes);
router.post("/", validateNewSizeData, addSize);
router.patch("/", updateSize);
router.delete("/:sizeId", deleteSize);


export default router;

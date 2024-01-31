
import { Router } from "express";
const router = Router();

// Import Routes 
import userRoutes from "./userRoutes.js"
import productRoutes from "./productRoutes.js"
import orderRoutes from "./orderRoutes.js"
import reviewRoutes from "./reviewRoutes.js"
import categoryRoutes from "./categoryRoutes.js"
import sizeRoutes from "./sizeRoutes.js"

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/review", reviewRoutes);
router.use("/category", categoryRoutes);
router.use("/size", sizeRoutes);

export default router;

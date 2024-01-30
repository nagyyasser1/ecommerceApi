const router = require("express").Router();

router.use("/users", require("./userRoutes"));
router.use("/products", require("./productRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/review", require("./reviewRoutes"));
router.use("/category", require("./categoryRoutes"));
router.use("/size", require("./sizeRoutes"));

module.exports = router;

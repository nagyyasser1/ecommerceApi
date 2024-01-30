const categoryController = require("../controllers/categoryController");
const sizeController = require('../controllers/sizeController');
const isAdmin = require("../middlewares/isAdmin");
const { validateNewSizeData } = require("../utils/validations/size.validations");
const router = require("express").Router();

router.use(isAdmin);

router.get("/", sizeController.getAllSizes);
router.post("/", validateNewSizeData, sizeController.addSize);
router.patch("/", sizeController.updateSize);
router.delete("/:sizeId", sizeController.deleteSize);


module.exports = router;

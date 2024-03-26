const express = require("express");
const router = express.Router();
const excelUploadRouter = require("./uploadExcel");
const excelDownloadRouter = require("./excelFileTemplate");

router.use(excelUploadRouter);
router.use(excelDownloadRouter);

module.exports = router;
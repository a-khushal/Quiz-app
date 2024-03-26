const express = require("express");
const router = express.Router();
const indexRouter = require("./indexComponents/index");
const whyRouter = require("./indexComponents/why");
const aboutRouter = require("./indexComponents/about");
const contactRouter = require("./indexComponents/contact");
const loginRouter = require("./indexComponents/login");
const studentRouter = require("./studentLogin/index");
const teacherRouter = require("./teacherLogin/index");
const adminRouter = require("./adminLogin/index");

router.use(indexRouter);
router.use(whyRouter);
router.use(aboutRouter);
router.use(contactRouter);
router.use(loginRouter)
router.use(studentRouter);
router.use(teacherRouter);
router.use(adminRouter);

module.exports = router;
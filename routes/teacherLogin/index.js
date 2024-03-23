const express = require("express");
const router = express.Router();
const showTeacherRouter = require("./showTeacher");
const cyRouter = require("./cy");
const csRouter = require("./cs");
const cdRouter = require("./cd");
const templateRouter = require("./quizTemplate");
const uploadRouter = require("./uploadFile");
const viewAllQuizzesRouter = require("./viewAllQuizzes");
const viewParticularRouter = require("./viewParticular");
const makeLiveRouter = require("./makeLive");
const madeLiveRouter = require("./madeLive");

router.use(showTeacherRouter);
router.use(cyRouter);
router.use(csRouter);
router.use(cdRouter);
router.use(templateRouter);
router.use(uploadRouter);
router.use(viewAllQuizzesRouter);
router.use(viewParticularRouter);
router.use(makeLiveRouter);
router.use(madeLiveRouter);

module.exports = router;


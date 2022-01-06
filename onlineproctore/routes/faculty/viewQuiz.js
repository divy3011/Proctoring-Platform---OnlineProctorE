const express = require('express');
const router = express.Router();
const {getCourseQuiz, addQuestions, uploadExcelFile, hideQuiz, disablePrevious, addWrittenQuestion, deleteQuiz, addMCQQuestion, viewDetailAnalysis} = require('../../controllers/faculty/viewEachQuiz');
const {getQuestions, markAnswer, submit, endTest, ipAddress, audio, windowBlurred, screenSharingOff, tabChanged, mobileDetected, multipleFace} = require('../../controllers/studentTa/quiz');
const {authFacultyTaQuiz, authStudentQuiz} = require('../../controllers/studentTa/courses');

router.route('/')
  .get(getCourseQuiz);

router.route('/addQuestions')
  .post([uploadExcelFile.single('excelFile'), authFacultyTaQuiz], addQuestions)

router.route('/hideQuiz')
  .get(authFacultyTaQuiz, hideQuiz)

router.route('/viewDetailAnalysis')
  .get(authFacultyTaQuiz, viewDetailAnalysis)

router.route('/disablePrevious')
  .get(authFacultyTaQuiz, disablePrevious)

router.route('/addWrittenQuestion')
  .post(authFacultyTaQuiz, addWrittenQuestion)

router.route('/addMCQQuestion')
  .post(authFacultyTaQuiz, addMCQQuestion)

router.route('/deleteQuiz')
  .post(authFacultyTaQuiz, deleteQuiz)

router.route('/getQuestions')
  .get(authStudentQuiz, getQuestions)

router.route('/markAnswer')
  .post(authStudentQuiz, markAnswer);

router.route('/submit')
  .post(authStudentQuiz, submit);

router.route('/endTest')
  .post(authStudentQuiz, endTest);

router.route('/ipAddress')
  .post(authStudentQuiz, ipAddress);

router.route('/audio')
  .post(authStudentQuiz, audio);

router.route('/windowBlurred')
  .post(authStudentQuiz, windowBlurred);

router.route('/screenSharingOff')
  .post(authStudentQuiz, screenSharingOff);

router.route('/tabChanged')
  .post(authStudentQuiz, tabChanged);

router.route('/mobileDetected')
  .post(authStudentQuiz, mobileDetected);

router.route('/multipleFace')
  .post(authStudentQuiz, multipleFace);

module.exports = router;
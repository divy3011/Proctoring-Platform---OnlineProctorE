const Quiz = require("../../models/quiz");
const User = require("../../models/user");
const Question = require('../../models/question');
const QuestionSubmission = require('../../models/questionSubmission');
const Submission = require('../../models/submission');
const IllegalAttempt = require('../../models/illegalAttempt');

exports.getQuestions = async (req, res) => {
  const quizId  = req.quizId;
  await User.findByToken(req.cookies.auth, async (err, user) => {
    await Quiz.findOne({_id: quizId}, async (err, quiz) => {
      await Question.find({quiz: quizId}, async (err, questions) => {
        await Submission.findOne({quiz: quizId, user: user._id}, async (err, submission) => {
          for await(let question of questions){
            await QuestionSubmission.exists({submission: submission._id, question: question._id}, async (err, questionSubmission) => {
              if(!questionSubmission){
                await QuestionSubmission.create({submission: submission._id, question: question._id, mcq: question.mcq});
              }
            })
          }
          setTimeout(() => {
            QuestionSubmission.find({submission: submission._id}, async (err, questionSubmissions) => {
              if(quiz.startDate > Date.now()){
                return res.status(400).json({
                  message: 'Unauthorized Access to Quiz Questions'
                });
              }
              return res.status(200).json({
                quizId: quizId,
                quiz: quiz,
                questions: questions,
                questionSubmissions: questionSubmissions
              })
            }).clone().catch(function(err){console.log(err)});
          }, 200);
        }).clone().catch(function(err){console.log(err)})
      }).clone().catch(function(err){console.log(err)})
    }).clone().catch(function(err){console.log(err)})
  })
}

exports.markAnswer = async (req, res) => {
  await QuestionSubmission.findOne({submission: req.body.submissionId, question: req.body.questionId}, (err, questionSubmission) => {
    questionSubmission.answerLocked = req.body.answerLocked;
    questionSubmission.notAnswered = req.body.notAnswered;
    questionSubmission.markedForReview = req.body.markedForReview;
    if(questionSubmission.mcq){
      questionSubmission.optionsMarked = req.body.markedAnswer;
    }
    else{
      questionSubmission.textfield = req.body.markedAnswer;
    }
    questionSubmission.save();
    return res.status(204).send();
  }).clone().catch(function(err){console.log(err)})
}

exports.submit = async (req, res) => {
  await Submission.findOne({_id: req.body.submissionId}, (err, submission) => {
    submission.submitted = true;
    submission.save();
    res.status(200).json({
      url: '/dashboard/user/course/'+submission.quiz.course._id
    });
  }).clone().catch(function(err){console.log(err)})
}

exports.endTest = async (req, res) => {
  const quizId = req.quizId;
  await Submission.findOne({_id: req.body.submissionId}, async (err, submission) => {
    submission.submitted = true;
    submission.save();
    await Quiz.findOne({_id: quizId}, (err, quiz) => {
      quiz.quizHeld = true;
      quiz.save();
      res.status(200).json({
        url: '/dashboard/user/course/'+submission.quiz.course._id
      });
    }).clone().catch(function(err){console.log(err)})
  }).clone().catch(function(err){console.log(err)})
}

exports.ipAddress = async (req, res) => {
  await Submission.findOne({_id: req.body.submissionId}, (err, submission) => {
    if(submission){
      submission.ipAddress = req.body.ip;
      submission.save();
      return res.status(204).send();
    }
  }).clone().catch(function(err){console.log(err)})
}

exports.audio = async (req, res) => {
  await Submission.findOne({_id: req.body.submissionId}, (err, submission) => {
    if(submission){
      submission.audioDetected += 1;
      submission.save();
      return res.status(204).send();
    }
  }).clone().catch(function(err){console.log(err)})
}

exports.windowBlurred = async (req, res) => {
  await Submission.findOne({_id: req.body.submissionId}, (err, submission) => {
    if(submission){
      submission.browserSwitched += 1;
      submission.save();
      return res.status(204).send();
    }
  }).clone().catch(function(err){console.log(err)})
}

exports.screenSharingOff = async (req, res) => {
  await Submission.findOne({_id: req.body.submissionId}, (err, submission) => {
    if(submission){
      submission.screenSharingTurnedOff += 1;
      submission.save();
      return res.status(204).send();
    }
  }).clone().catch(function(err){console.log(err)})
}

exports.tabChanged = async (req, res) => {
  await Submission.findOne({submission: req.body.submissionId}, async (err, submission) => {
    submission.browserSwitched += 1;
    submission.save();
    await IllegalAttempt.find({submission: req.body.submissionId, activity: req.body.type}, async (err, illegalAttempts) => {
      if(illegalAttempts.length <= 40){
        await IllegalAttempt.create({submission: req.body.submissionId, activity: req.body.type, image: req.body.frame});
      }
      return res.status(204).send();
    }).clone().catch(function(err){console.log(err)})
  }).clone().catch(function(err){console.log(err)})
}

exports.mobileDetected = async (req, res) => {
  await Submission.findOne({submission: req.body.submissionId}, async (err, submission) => {
    submission.mobileDetected += 1;
    submission.save();
    await IllegalAttempt.find({submission: req.body.submissionId, activity: req.body.type}, async (err, illegalAttempts) => {
      if(illegalAttempts.length <= 40){
        await IllegalAttempt.create({submission: req.body.submissionId, activity: req.body.type, image: req.body.frame});
      }
      return res.status(204).send();
    }).clone().catch(function(err){console.log(err)})
  }).clone().catch(function(err){console.log(err)})  
}

exports.multipleFace = async (req, res) => {
  await Submission.findOne({submission: req.body.submissionId}, async (err, submission) => {
    submission.multiplePerson += 1;
    submission.save();
    await IllegalAttempt.find({submission: req.body.submissionId, activity: req.body.type}, async (err, illegalAttempts) => {
      if(illegalAttempts.length <= 40){
        await IllegalAttempt.create({submission: req.body.submissionId, activity: req.body.type, image: req.body.frame});
      }
      return res.status(204).send();
    }).clone().catch(function(err){console.log(err)})
  }).clone().catch(function(err){console.log(err)})
}

exports.noPerson = async (req, res) => {
  await Submission.findOne({submission: req.body.submissionId}, async (err, submission) => {
    submission.noPerson += 1;
    submission.save();
    return res.status(204).send();
  }).clone().catch(function(err){console.log(err)})
}
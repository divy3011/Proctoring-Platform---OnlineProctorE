const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAutopopulate = require('mongoose-autopopulate');
const Enrollment = require('./enrollment');
const Announcement = require('./announcement');
const Quiz = require('./quiz');

const Course = new Schema({
  instructors : [{
    type : Schema.Types.ObjectId,
    ref : 'User',
    required : true,
    autopopulate: true
  }],
  courseImage : {
    data: Buffer,
    contentType: String
  },
  courseName : {
    type : String,
    required : true
  },
  createdOn : {
    type : Date,
    default : Date.now
  }},{
    timestamps: true
})

Course.post("remove", async function(res, next) {
  await Enrollment.find({course: this._id}, async (err, enrollments) => {
    for await (let enrollment of enrollments){
      enrollment.remove();
    }
  }).clone().catch(function(err){console.log(err)});
  await Announcement.remove({course: this._id});
  await Quiz.remove({course: this._id});
  next();
});

Course.plugin(mongooseAutopopulate);
module.exports = mongoose.model('Course', Course);
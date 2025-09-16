const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentSchema = new Schema(
  {
    personalInfo: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      stdId:{
        type:String,
        required:true
      },
      username: {
        type: String,
        unique: true,
        trim: true,
      },
      DOB: {
        type: String,
      },
      gender: {
        type: String,
        // required: true,
      },
      bloodGroup:{
        type:String
      },
      age:{
        type:String,
      },
      class: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },
      section:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
      },
      rollNo:{
        type: String,
        required: true
      },
      admissionDate: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
      },
      contactDetails: {
        mobileNumber: {
          type: String,
          // required: true,
        },
        email: String,
      },
      address:{
        type:String
      },
      image: {
        type: String,
        url: String,
      },
      password: {
        type: String,
        required: true,
      },
      fees:{
        required:true,
        type: String,
        enum:["Paid", "Due"],
        default: "Paid"
      }
    },
    parent:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Parent"
    },
    
    //Curriculum
    curriculum:{
      academicYear:{
        type:String
      },
      admissionType:{
        type:String
      }
    },
    // curriculum: { // future 
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Curriculum",
    // },
    //Assignments
    assignments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
    //exams & reports
    exams: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },
    reports: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },
  },
  { timestamps: true }
);
const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;

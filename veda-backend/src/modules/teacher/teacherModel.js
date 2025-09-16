const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  // Personal Info
  personalInfo: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Staff"
      // name: {
      //   type: String,
      //   required: true,
      //   trim: true,
      // },
      // staffId:{
      //   type:String,
      //   required:true,
      //   unique: true
      // },
      // username: {
      //   type: String,
      //   unique: true,
      //   // required: true,
      //   trim: true,
      // },
      // gender: { 
      //   type: String, 
      //   enum: ["Male", "Female", "Other"] 
      // },
      // role: {
      //   type: String,
      //   enum: ["Teacher", "Principal", "Accountant", "Admin", "Other"],
      //   required: true,
      // },
      // contactDetails: {
      //   email: {
      //     type: String,
      //     required: true,
      //     unique: true
      //   },
      //   mobileNumber: String,
      // },
      // image: {
      //   type: String,
      // },
      // address: { type: String },
      // password: { type: String, required: true }, 
  },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  isClassTeacherOf: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  department: {
        type: String,
        required: true,
      },
  salaryDetails: {
      baseSalary: {
        type: Number,
      },
      allowances: {
        type: Number,
      },
      deductions: {
        type: Number,
      },
      netSalary: {
        type: Number,
      },
    },
  // Assignments..?
  // classesAssigned: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Class" // which classes teacher handles
  //   }
  // ],
  // subjectsAssigned: [ // subjects handled by teacher
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Subject" 
  //   }
  // ],

  status: {
    type: String,
    enum: ["Active", "On Leave"],
    default: "Active"
  }
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
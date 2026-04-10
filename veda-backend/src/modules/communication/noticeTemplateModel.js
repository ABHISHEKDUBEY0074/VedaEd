const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoticeTemplateSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

NoticeTemplateSchema.index({ createdAt: -1 });

const NoticeTemplate = mongoose.model('NoticeTemplate', NoticeTemplateSchema);
module.exports = NoticeTemplate;

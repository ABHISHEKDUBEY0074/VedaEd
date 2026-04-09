const NoticeTemplate = require('./noticeTemplateModel');

exports.createNoticeTemplate = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    const template = await NoticeTemplate.create({
      title: title.trim(),
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Notice template created successfully',
      data: template
    });
  } catch (error) {
    console.error('Error creating notice template:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

exports.getNoticeTemplates = async (req, res) => {
  try {
    const templates = await NoticeTemplate.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching notice templates:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

exports.updateNoticeTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { title, message } = req.body;

    const template = await NoticeTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Notice template not found'
      });
    }

    if (title !== undefined) template.title = title.trim();
    if (message !== undefined) template.message = message.trim();

    if (!template.title || !template.message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    await template.save();

    res.status(200).json({
      success: true,
      message: 'Notice template updated successfully',
      data: template
    });
  } catch (error) {
    console.error('Error updating notice template:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

exports.deleteNoticeTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = await NoticeTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Notice template not found'
      });
    }

    await NoticeTemplate.findByIdAndDelete(templateId);

    res.status(200).json({
      success: true,
      message: 'Notice template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notice template:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

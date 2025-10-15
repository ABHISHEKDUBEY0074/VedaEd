const Message = require('./messageModel');
const CommunicationLog = require('./communicationLogModel');
const Student = require('../student/studentModels');
const Teacher = require('../teacher/teacherModel');
const Staff = require('../staff/staffModels');
const Parent = require('../parents/parentModel');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { sender, senderModel, receiver, receiverModel, subject, content, messageType, priority, attachments, replyTo } = req.body;

    // Validate required fields
    if (!sender || !senderModel || !receiver || !receiverModel || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if sender exists
    const senderExists = await validateUser(sender, senderModel);
    if (!senderExists) {
      return res.status(400).json({
        success: false,
        message: 'Sender not found'
      });
    }

    // Check if receiver exists
    const receiverExists = await validateUser(receiver, receiverModel);
    if (!receiverExists) {
      return res.status(400).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    const messageData = {
      sender,
      senderModel,
      receiver,
      receiverModel,
      subject,
      content,
      messageType: messageType || 'text',
      priority: priority || 'medium',
      attachments: attachments || [],
      replyTo: replyTo || null
    };

    // If this is a reply, set threadId
    if (replyTo) {
      const parentMessage = await Message.findById(replyTo);
      if (parentMessage) {
        messageData.threadId = parentMessage.threadId || parentMessage._id;
      }
    }

    const message = await Message.create(messageData);

    // Log the action
    await CommunicationLog.create({
      user: sender,
      userModel: senderModel,
      action: 'message_sent',
      target: message._id,
      targetModel: 'Message',
      details: { receiver, receiverModel, subject }
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Get messages for a user (inbox)
exports.getMessages = async (req, res) => {
  try {
    const { userId, userModel } = req.params;
    const { page = 1, limit = 10, status, priority, isImportant } = req.query;

    const query = { receiver: userId, receiverModel: userModel };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (isImportant !== undefined) query.isImportant = isImportant === 'true';

    const messages = await Message.find(query)
      .populate('sender', 'personalInfo.name personalInfo.email')
      .populate('receiver', 'personalInfo.name personalInfo.email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Get sent messages for a user
exports.getSentMessages = async (req, res) => {
  try {
    const { userId, userModel } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const messages = await Message.find({ sender: userId, senderModel: userModel })
      .populate('sender', 'personalInfo.name personalInfo.email')
      .populate('receiver', 'personalInfo.name personalInfo.email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ sender: userId, senderModel: userModel });

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Get a specific message
exports.getMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId, userModel } = req.query;

    const message = await Message.findById(messageId)
      .populate('sender', 'personalInfo.name personalInfo.email')
      .populate('receiver', 'personalInfo.name personalInfo.email')
      .populate('replyTo')
      .populate('threadId');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read if user is the receiver
    if (userId && userModel && message.receiver.toString() === userId && message.receiverModel === userModel) {
      if (message.status !== 'read') {
        message.status = 'read';
        message.readAt = new Date();
        await message.save();

        // Log the action
        await CommunicationLog.create({
          user: userId,
          userModel: userModel,
          action: 'message_read',
          target: message._id,
          targetModel: 'Message'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status, userId, userModel } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.status = status;
    if (status === 'read') {
      message.readAt = new Date();
    }

    await message.save();

    // Log the action
    if (userId && userModel) {
      await CommunicationLog.create({
        user: userId,
        userModel: userModel,
        action: 'message_read',
        target: message._id,
        targetModel: 'Message'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message status updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId, userModel } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user has permission to delete (sender or receiver)
    const canDelete = (message.sender.toString() === userId && message.senderModel === userModel) ||
                     (message.receiver.toString() === userId && message.receiverModel === userModel);

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this message'
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Get message thread
exports.getMessageThread = async (req, res) => {
  try {
    const { threadId } = req.params;

    const messages = await Message.find({ $or: [{ _id: threadId }, { threadId: threadId }] })
      .populate('sender', 'personalInfo.name personalInfo.email')
      .populate('receiver', 'personalInfo.name personalInfo.email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching message thread:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Helper function to validate user existence
async function validateUser(userId, userModel) {
  try {
    let user;
    switch (userModel) {
      case 'Student':
        user = await Student.findById(userId);
        break;
      case 'Teacher':
        // For teachers, we need to check both Teacher and Staff models
        user = await Teacher.findById(userId).populate('personalInfo');
        if (!user) {
          user = await Staff.findById(userId);
        }
        break;
      case 'Parent':
        user = await Parent.findById(userId);
        break;
      case 'Admin':
        user = await Staff.findById(userId);
        break;
      default:
        return false;
    }
    return !!user;
  } catch (error) {
    return false;
  }
}

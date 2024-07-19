const Conversation = require("../Models/Conversation");
const Message = require("../Models/MessageSchema");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      const newConversation = new Conversation({
        members: [senderId, receiverId],
      });
      conversation = await newConversation.save();
    }

    // Create and save new message
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    // Update conversation with new message
    conversation.messages.push(newMessage._id);
    await conversation.save();

    res
      .status(200)
      .json({ message: "Message sent successfully", conversation });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error sending message", error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    console.log(senderId)
    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate("messages")
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json({ conversation });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting messages", error: err.message });
  }
};

module.exports = { sendMessage, getMessages };

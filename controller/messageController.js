import { Message } from "../models/messageSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const sendMessage = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;
  try {
    if (!firstName || !lastName || !email || !phone || !message) {
      return next(new ErrorHandler("Please Fill Full Form", 400));
    }
    const sendMessage = new Message(req.body);
    await sendMessage.save();
    res.status(200).json({
      status: true,
      message: "Message Send Successfully",
    });
  } catch (error) {
    console.log("Error in sendMessage", error);
  }
});

export const getAllMessages = catchAsyncError(async (req, res, next) => {
  const messages = await Message.find({});
  const totalMessages = messages.length;
  res.status(200).json({
    status: true,
    message: "Successfully retrieved all messages",
    totalMessages,
    messages,
  });
});


export const deleteMessages = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    let messages = await Message.findById(id);
    if (!messages) {
      return next(new ErrorHandler("Message not found", 400))
    }
    messages = await Message.findByIdAndDelete(id)
    res.status(200).json({
      message: "Message deleted successfully",
      status: true,
    })
  } catch (error) {
    next(new ErrorHandler("Error while deleting", 400))
  }
})

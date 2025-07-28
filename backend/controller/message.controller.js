import { Conversation } from "../models/conversation.model.js"
import { Message } from "../models/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js"

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id
        const recieverId = req.params.id
        const { textMessage: message } = req.body
        console.log("Incoming message:", message)

        // Check for existing conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        })

        // Create conversation if not found
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recieverId],
                messages: [] // Ensure messages array is initialized
            })
        }

        // Create new message
        const newMessage = await Message.create({
            senderId,
            recieverId,
            message
        })

        // Push the message ID into the conversation's messages
        conversation.messages.push(newMessage._id)

        // Save both documents
        await Promise.all([conversation.save(), newMessage.save()])

        // Emit message via socket.io to receiver if online
        const receiverSocketId = getReceiverSocketId(recieverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        return res.status(200).json({
            success: true,
            newMessage
        })
    } catch (error) {
        console.error("Error in sendMessage:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// Get all messages between two users
export const getMessage = async (req, res) => {
    try {
        const senderId = req.id
        const recieverId = req.params.id

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        }).populate("messages")

        if (!conversation) {
            return res.status(200).json({
                success: true,
                messages: []
            })
        }

        return res.status(200).json({
            success: true,
            messages: conversation.messages
        })
    } catch (error) {
        console.error("Error in getMessage:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

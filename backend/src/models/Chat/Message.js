import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        uppercase: true,
    },
    sender: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    isAI: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;

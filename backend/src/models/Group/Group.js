import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
            trim: true,
    },

    groupCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    currentCode: {
        type: String,
        default: "",
    },

    language: {
        type: String,
        default: "javascript",
    },
}, { timeseries: true })

const Group = mongoose.model("Group", groupSchema);

export default Group;
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        default: "",
    },
    language: {
        type: String,
        default: "javascript",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

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

    // Legacy single-file fields (kept for backward compatibility)
    currentCode: {
        type: String,
        default: "",
    },

    language: {
        type: String,
        default: "javascript",
    },

    // Multi-file support
    files: {
        type: [fileSchema],
        default: [],
    },
}, { timeseries: true })

/**
 * Pre-save hook: auto-migrate legacy groups that have currentCode but no files.
 * Moves the single-file data into the files array as "main.js".
 */
groupSchema.pre('save', function (next) {
    if (this.files.length === 0) {
        const ext = this.language === 'python' ? '.py'
            : this.language === 'java' ? '.java'
            : this.language === 'cpp' ? '.cpp'
            : this.language === 'c' ? '.c'
            : this.language === 'typescript' ? '.ts'
            : '.js';
        this.files.push({
            fileName: `main${ext}`,
            code: this.currentCode || "",
            language: this.language || "javascript",
        });
    }
    next();
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
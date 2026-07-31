import Group from "../../models/Group/Group.js";

/**
 * Helper: detect language from file extension
 */
const detectLanguage = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const langMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'md': 'markdown',
    };
    return langMap[ext] || 'javascript';
};

/**
 * GET /api/group/:groupCode/files
 * List all files in a group
 */
export const getFiles = async (req, res) => {
    try {
        const { groupCode } = req.params;
        const group = await Group.findOne({ groupCode: groupCode.trim().toUpperCase() });

        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        // Auto-migrate legacy groups with no files
        if (group.files.length === 0) {
            await group.save(); // triggers pre-save hook to migrate
        }

        return res.status(200).json({
            success: true,
            files: group.files,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/group/:groupCode/files
 * Create a new file in a group
 */
export const createFile = async (req, res) => {
    try {
        const { groupCode } = req.params;
        const { fileName, code, language } = req.body;

        if (!fileName?.trim()) {
            return res.status(400).json({ success: false, message: "File name is required" });
        }

        const group = await Group.findOne({ groupCode: groupCode.trim().toUpperCase() });

        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        // Check for duplicate file name
        const exists = group.files.some(
            f => f.fileName.toLowerCase() === fileName.trim().toLowerCase()
        );
        if (exists) {
            return res.status(409).json({ success: false, message: "A file with that name already exists" });
        }

        const detectedLang = language || detectLanguage(fileName.trim());

        const newFile = {
            fileName: fileName.trim(),
            code: code || "",
            language: detectedLang,
        };

        group.files.push(newFile);
        await group.save();

        // Return the newly added file (last in array)
        const addedFile = group.files[group.files.length - 1];

        return res.status(201).json({
            success: true,
            file: addedFile,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * PUT /api/group/:groupCode/files/:fileId
 * Rename a file or update its language
 */
export const updateFile = async (req, res) => {
    try {
        const { groupCode, fileId } = req.params;
        const { newFileName } = req.body;

        if (!newFileName?.trim()) {
            return res.status(400).json({ success: false, message: "New file name is required" });
        }

        const group = await Group.findOne({ groupCode: groupCode.trim().toUpperCase() });

        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        const file = group.files.id(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        // Check for duplicate file name (exclude current file)
        const duplicateExists = group.files.some(
            f => f._id.toString() !== fileId && f.fileName.toLowerCase() === newFileName.trim().toLowerCase()
        );
        if (duplicateExists) {
            return res.status(409).json({ success: false, message: "A file with that name already exists" });
        }

        const oldFileName = file.fileName;
        file.fileName = newFileName.trim();
        file.language = detectLanguage(newFileName.trim());
        await group.save();

        return res.status(200).json({
            success: true,
            file,
            oldFileName,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * DELETE /api/group/:groupCode/files/:fileId
 * Delete a file from a group
 */
export const deleteFile = async (req, res) => {
    try {
        const { groupCode, fileId } = req.params;

        const group = await Group.findOne({ groupCode: groupCode.trim().toUpperCase() });

        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        // Prevent deleting the last file
        if (group.files.length <= 1) {
            return res.status(400).json({ success: false, message: "Cannot delete the last file in a group" });
        }

        const file = group.files.id(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        const deletedFileName = file.fileName;
        group.files.pull(fileId);
        await group.save();

        return res.status(200).json({
            success: true,
            message: "File deleted successfully",
            deletedFileName,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { detectLanguage };

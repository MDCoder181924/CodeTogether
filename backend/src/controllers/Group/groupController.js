import Group from "../../models/Group/Group.js";
import Message from "../../models/Chat/Message.js";

export const joinGroup = async (req, res) => {
    try {
        const { groupCode } = req.body;

        if (!groupCode?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Group code is required",
            });
        }

        const group = await Group.findOne({ groupCode: groupCode.trim().toUpperCase() });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        const userId = req.user.userId;

        const alreadyMember = group.members.includes(userId);

        if (!alreadyMember) {
            group.members.push(userId);
            await group.save();
        }
        res.status(200).json({
            success: true,
            group,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createGroup = async (req, res) => {
    try {
        const { groupName } = req.body;

        if (!groupName) {
            return res.status(400).json({
                success: false,
                message: "Group name is required",
            });
        }

        const groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const group = await Group.create({
            groupName,
            groupCode,
            owner: req.user.userId,
            members: [req.user.userId],
        });

        res.status(201).json({
            success: true,
            group,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required",
            });
        }

        const groups = await Group.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        }).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            groups,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { groupCode } = req.params;
        const userId = req.user?.userId;

        if (!groupCode) {
            return res.status(400).json({
                success: false,
                message: "Group code parameter is required",
            });
        }

        const group = await Group.findOne({ groupCode: groupCode.toUpperCase() });
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        if (group.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the group owner can delete this group",
            });
        }

        await Group.deleteOne({ _id: group._id });
        await Message.deleteMany({ roomCode: group.groupCode });

        return res.status(200).json({
            success: true,
            message: "Group deleted successfully",
            groupCode: group.groupCode
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
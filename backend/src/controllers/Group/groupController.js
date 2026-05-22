import Group from "../../models/Group/Group.js";

export const joinGroup = async (req, res) => {
    try {
        const { groupCode } = req.body;

        if (!groupCode?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Group code is required",
            })
        }

        const group = await Group.findOne({ groupCode: groupCode.trim().toUpperCase() });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            })
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
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const createGroup = async (req, res) => {
    try {
        const { groupName } = req.body;

        if (!groupName) {
            return res.status(400).json({
                success: false,
                message: "Group name is reqired",
            })
        }

        const groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const group = await Group.create({
            groupName,
            groupCode,
            owner: req.user.userId,
            members: [req.user.userId],
        })

        res.status(201).json({
            success: true,
            group,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
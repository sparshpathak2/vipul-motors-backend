import { prisma } from '../../db.config.js';

// GET all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }, // exclude password
        });
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// GET single user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }, // exclude password
        });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// POST new user
// export const createUser = async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const existing = await prisma.user.findUnique({ where: { email } });
//         if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

//         const newUser = await prisma.user.create({
//             data: {
//                 id: nanoid(8),
//                 name,
//                 email,
//                 password, // assume it's already hashed
//             },
//         });
//         res.status(201).json({
//             success: true,
//             data: { id: newUser.id, name: newUser.name, email: newUser.email },
//         });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Internal server error", error: err.message });
//     }
// };

// PUT (update) user
// export const updateUser = async (req, res) => {
//     const { id } = req.params;
//     const { name, email } = req.body;

//     try {
//         const updated = await prisma.user.update({
//             where: { id },
//             data: { name, email },
//             select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
//         });
//         res.json({ success: true, data: updated });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Internal server error", error: err.message });
//     }
// };

// DELETE user
export const deleteUser = async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.status(204).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

import express from 'express';
import {
    deleteUser,
    getAllUsers,
    getUserById
} from '../controllers/user.controller.js';

const router = express.Router();

// 📌 Get all users
router.get('/', getAllUsers);

// 📌 Get single user by ID
router.get('/:id', getUserById);

// 📌 Delete single user by ID
router.delete('/:id', deleteUser);

export default router;

import { nanoid } from 'nanoid';
import { prisma } from '../../db.config.js';

// GET all queries
export const getAllQueries = async (req, res) => {
    try {
        const queries = await prisma.query.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: queries });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// GET single query by ID
export const getQueryById = async (req, res) => {
    try {
        const query = await prisma.query.findUnique({ where: { id: req.params.id } });
        if (!query) return res.status(404).json({ success: false, message: 'Query not found' });
        res.json({ success: true, data: query });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// POST new query
export const createQuery = async (req, res) => {
    // console.log("Create query api hit")
    const { name, email, mobile, location, message, source } = req.body;
    try {
        const newQuery = await prisma.query.create({
            data: { id: nanoid(8), name, email, mobile, location, message, source },
        });
        res.status(201).json({ success: true, data: newQuery });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// PUT (update) query
export const updateQuery = async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, location, message, source } = req.body;
    try {
        const updated = await prisma.query.update({
            where: { id },
            data: { name, email, mobile, location, message, source },
        });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// DELETE query
export const deleteQuery = async (req, res) => {
    try {
        await prisma.query.delete({ where: { id: req.params.id } });
        res.status(204).json({ success: true, message: "Query Deleted Successfully" }); // No content
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

import { nanoid } from 'nanoid';
import { prisma } from '../../db.config.js';

// GET all truvalueModels
export const getAllTruevalueModels = async (req, res) => {
    try {
        const truevalueModels = await prisma.trueValueModel.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                image: true,
            },
        });
        res.json({ success: true, data: truevalueModels });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// GET single truvalueModel by ID
export const getTruevalueModelById = async (req, res) => {
    try {
        const truevalueModel = await prisma.trueValueModel.findUnique({
            where: { id: req.params.id },
            include: {
                image: true,
            },
        });
        if (!truevalueModel) return res.status(404).json({ success: false, message: 'Model not found' });
        res.json({ success: true, data: truevalueModel });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// POST new truvalueModel
export const createTruevalueModel = async (req, res) => {
    const { modelName, description, make, year, variant, color, imageId } = req.body;

    try {
        const newTruevalueModel = await prisma.trueValueModel.create({
            data: {
                id: nanoid(8),
                modelName,
                description,
                make,
                year: year ? Number(year) : null,
                variant,
                color,
                imageId: imageId || null,
            },
            include: {
                image: true,
            },
        });

        res.status(201).json({ success: true, data: newTruevalueModel });
    } catch (err) {
        console.error("Error creating TrueValueModel:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

// PUT (update) truvalueModel
export const updateTruevalueModel = async (req, res) => {
    const { id } = req.params; // expecting /truevalue-model/:id
    const { modelName, description, make, year, variant, color, imageId } = req.body;

    try {
        const updatedTruevalueModel = await prisma.trueValueModel.update({
            where: { id },
            data: {
                modelName,
                description,
                make,
                year: year ? Number(year) : null,
                variant,
                color,
                imageId: imageId || null,
            },
            include: {
                image: true,
            },
        });

        res.status(200).json({ success: true, data: updatedTruevalueModel });
    } catch (err) {
        console.error("Error updating TrueValueModel:", err);

        // Prisma throws a known error if record not found
        if (err.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: `TrueValueModel with id ${id} not found`,
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};


// DELETE truvalueModel
export const deleteTruevalueModel = async (req, res) => {
    try {
        await prisma.trueValueModel.delete({ where: { id: req.params.id } });
        res.status(204).json({ success: true, message: "TrueValueModel Deleted Successfully" }); // No content
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

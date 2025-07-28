import express from 'express';
import {
    getAllQueries,
    getQueryById,
    createQuery,
    updateQuery,
    deleteQuery
} from '../controllers/query.controller.js';

const router = express.Router();

router.get('/', getAllQueries);
router.get('/:id', getQueryById);
router.post('/', createQuery);
router.put('/:id', updateQuery);
router.delete('/:id', deleteQuery);

export default router;
import express from 'express';
import {
    getAllTruevalueModels,
    getTruevalueModelById,
    createTruevalueModel,
    updateTruevalueModel,
    deleteTruevalueModel
} from '../controllers/truevalue.controller.js';

const router = express.Router();

router.get('/', getAllTruevalueModels);
router.get('/:id', getTruevalueModelById);
router.post('/', createTruevalueModel);
router.put('/:id', updateTruevalueModel);
router.delete('/:id', deleteTruevalueModel);

export default router;
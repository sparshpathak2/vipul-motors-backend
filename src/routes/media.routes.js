import express from 'express';
import {
    getAllImages,
    getAllBanners,
    getImageById,
    getBannerById,
    // createImage,
    createOrUpdateBanner,
    updateImageById,
    updateBannerById,
    deleteImageById,
    deleteBannerById,
} from '../controllers/media.controller.js';

const router = express.Router();

router.get('/images', getAllImages);
router.get('/banners', getAllBanners);
router.get('/images/:id', getImageById);
router.get('/banners/:id', getBannerById);
// router.post('/images', createImage);
router.post('/banners', createOrUpdateBanner);
router.put('/images/:id', updateImageById);
router.put('/banners/:id', updateBannerById);
router.delete('/images/:id', deleteImageById);
router.delete('/banners/:id', deleteBannerById);

export default router;

import { nanoid } from 'nanoid';
import { prisma } from '../../db.config.js';
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION;

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// GET all queries
export const getAllImages = async (req, res) => {
    try {
        const images = await prisma.image.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: images });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

export const getAllBanners = async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({
            include: {
                image: true, // 👈 this pulls in the related Image
            },
            orderBy: {
                order: 'asc', // or 'desc' depending on requirement
            },
        });

        res.json({ success: true, data: banners });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// GET single query by ID
export const getImageById = async (req, res) => {
    try {
        const image = await prisma.image.findUnique({ where: { id: req.params.id } });
        if (!image) return res.status(404).json({ success: false, message: 'Query not found' });
        res.json({ success: true, data: image });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// GET single query by ID
export const getBannerById = async (req, res) => {
    try {
        const banner = await prisma.banner.findUnique({ where: { id: req.params.id } });
        if (!banner) return res.status(404).json({ success: false, message: 'Query not found' });
        res.json({ success: true, data: banner });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// export const createImage = async (req, res) => {
//     try {
//         const { screen, order, isActive, imageId } = req.body;

//         if (!imageId) {
//             return res.status(400).json({ error: "imageId is required" });
//         }

//         // Check if the image exists
//         const existingImage = await prisma.image.findUnique({
//             where: { id: imageId }
//         });

//         if (!existingImage) {
//             return res.status(404).json({ error: "Image not found" });
//         }

//         // Create Banner with relation to existing Image
//         const banner = await prisma.banner.create({
//             data: {
//                 id: nanoid(8),
//                 screen,
//                 order,
//                 isActive,
//                 image: { connect: { id: imageId } }
//             },
//             include: {
//                 image: true, // include image in response
//             }
//         });

//         res.status(201).json({ success: true, message: "Banner created success", data: banner });
//     } catch (error) {
//         console.error("Error creating banner:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// POST new query


// export const createBanner = async (req, res) => {
//     try {
//         const { screen, order, imageId } = req.body;

//         if (!imageId) {
//             return res.status(400).json({ error: "imageId is required" });
//         }

//         // Check if the image exists
//         const existingImage = await prisma.image.findUnique({
//             where: { id: imageId }
//         });

//         if (!existingImage) {
//             return res.status(404).json({ error: "Image not found" });
//         }

//         // Create Banner with relation to existing Image
//         const banner = await prisma.banner.create({
//             data: {
//                 id: nanoid(8),
//                 screen,
//                 order: order ? parseInt(order, 10) : null,
//                 image: { connect: { id: imageId } }
//             },
//             include: {
//                 image: true, // include image in response
//             }
//         });

//         res.status(201).json({ success: true, message: "Banner created success", data: banner });
//     } catch (error) {
//         console.error("Error creating banner:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

export const createOrUpdateBanner = async (req, res) => {
    try {
        const { screen, order, imageId } = req.body;

        if (!imageId) {
            return res.status(400).json({ error: "imageId is required" });
        }

        // Check if the image exists
        const existingImage = await prisma.image.findUnique({
            where: { id: imageId }
        });

        if (!existingImage) {
            return res.status(404).json({ error: "Image not found" });
        }

        // Check if a banner with same screen & order exists
        const existingBanner = await prisma.banner.findFirst({
            where: {
                screen,
                order: order ? parseInt(order, 10) : null
            }
        });

        let banner;
        if (existingBanner) {
            // Update existing banner with new imageId
            banner = await prisma.banner.update({
                where: { id: existingBanner.id },
                data: {
                    image: { connect: { id: imageId } },
                    // imageUrl: existingImage.url
                },
                include: {
                    image: true
                }
            });

            return res.status(200).json({
                success: true,
                message: "Banner updated successfully",
                data: banner
            });
        } else {
            // Create new banner
            banner = await prisma.banner.create({
                data: {
                    id: nanoid(8),
                    screen,
                    order: order ? parseInt(order, 10) : null,
                    image: { connect: { id: imageId } },
                    // imageUrl: existingImage.url
                },
                include: {
                    image: true
                }
            });

            return res.status(201).json({
                success: true,
                message: "Banner created successfully",
                data: banner
            });
        }
    } catch (error) {
        console.error("Error creating/updating banner:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update Image by ID
export const updateImageById = async (req, res) => {
    const { id } = req.params; // image id
    const { url, alt } = req.body;

    try {
        const updatedImage = await prisma.image.update({
            where: { id },
            data: {
                url,
                alt,
            },
        });

        res.json({
            success: true,
            message: "Image updated successfully",
            image: updatedImage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update image" });
    }
};

// Update Banner by ID
export const updateBannerById = async (req, res) => {
    const { id } = req.params; // banner id
    const { screen, order, imageId } = req.body;

    try {
        // Check if image exists before updating banner
        if (imageId) {
            const existingImage = await prisma.image.findUnique({
                where: { id: imageId },
            });

            if (!existingImage) {
                return res.status(400).json({ success: false, message: "Image not found" });
            }
        }

        const updatedBanner = await prisma.banner.update({
            where: { id },
            data: {
                screen,
                order,
                imageId, // optional, only updates if passed
            },
            include: { image: true }, // return banner + linked image
        });

        res.json({
            success: true,
            message: "Banner updated successfully",
            banner: updatedBanner,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update banner" });
    }
};

// 🗑️ Delete Image by ID
// export const deleteImageById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // First unlink references
//         await prisma.banner.updateMany({
//             where: { imageId: id },
//             data: { imageId: null },
//         });

//         await prisma.trueValueModel.updateMany({
//             where: { imageId: id },
//             data: { imageId: null },
//         });

//         // Delete the image
//         await prisma.image.delete({
//             where: { id },
//         });

//         res.status(200).json({ success: true, message: "Image deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting image:", error);
//         res.status(500).json({ success: false, message: "Failed to delete image" });
//     }
// };

export const deleteImageById = async (req, res) => {
    try {
        const { id } = req.params;

        // Get image from DB (we need the URL to delete from S3)
        const image = await prisma.image.findUnique({
            where: { id },
        });

        if (!image) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        // Extract the S3 key from URL (everything after the bucket hostname)
        const fileUrl = image.url;
        const s3Prefix = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/`;
        const s3Key = fileUrl.replace(s3Prefix, "");

        // First unlink references in other tables
        await prisma.banner.updateMany({
            where: { imageId: id },
            data: { imageId: null },
        });

        await prisma.trueValueModel.updateMany({
            where: { imageId: id },
            data: { imageId: null },
        });

        // Delete the image record from DB
        await prisma.image.delete({
            where: { id },
        });

        // Delete file from S3
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: s3Key,
            })
        );

        res.status(200).json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ success: false, message: "Failed to delete image", error: error.message });
    }
};

// 🗑️ Delete Banner by ID
export const deleteBannerById = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete banner
        await prisma.banner.delete({
            where: { id },
        });

        res.status(200).json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        console.error("Error deleting banner:", error);
        res.status(500).json({ success: false, message: "Failed to delete banner" });
    }
};

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";
import { nanoid } from 'nanoid';
import { prisma } from '../../db.config.js';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const file = req.file;
        const fileExt = path.extname(file.originalname);
        const fileName = `public/${Date.now()}-${file.originalname}`; // inside "public/" folder

        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            // ACL: "public-read", // ensures uploaded file is publicly readable
        };

        await s3Client.send(new PutObjectCommand(params));

        const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        // Create Image entry in DB
        const image = await prisma.image.create({
            data: {
                id: nanoid(8),
                url: fileUrl,
                alt: req.body.imageAlt || file.originalname,
            },
        });

        res.json({
            success: true,
            message: "File uploaded successfully",
            url: fileUrl,
            data: image,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, message: "Upload failed", error: error.message });
    }
};


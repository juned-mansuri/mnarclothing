import { v2 as cloudinary } from "cloudinary";
import glimpseModel from "../models/glimpseModel.js";

// Function to add a glimpse
const addGlimpse = async (req, res) => {
    try {
        // Handle adding a glimpse
        const image = req.file;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded",
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image.path, {
            resource_type: "image",
        });

        // Create a new glimpse
        const glimpseData = {
            image: result.secure_url,
            date: Date.now(),
        };

        const glimpse = new glimpseModel(glimpseData);
        await glimpse.save();

        res.json({
            success: true,
            message: "Glimpse added successfully",
            data: glimpse,
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Function to list all glimpses
const listGlimpses = async (req, res) => {
    try {
        const glimpses = await glimpseModel.find({}).sort({ date: -1 });

        res.json({
            success: true,
            message: "Glimpses fetched successfully",
            data: glimpses,
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Function to delete a glimpse
const deleteGlimpse = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Glimpse ID is required",
            });
        }
        
        await glimpseModel.findByIdAndDelete(id);
        
        res.json({
            success: true,
            message: "Glimpse deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

export { addGlimpse, listGlimpses, deleteGlimpse };
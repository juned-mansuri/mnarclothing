// productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    sizes: {
        type: Array,
        required: true
    },
    // Add stock management with stock per size
    stock: {
        type: Map,
        of: Number,
        default: {}
    },
    bestseller: {
        type: Boolean
    },
    showcase: {
        type: Boolean
    },
    mystery: {
        type: Boolean
    },
    date: {
        type: Number,
        required: true
    }
})

const productModel = mongoose.models.product || mongoose.model('Product', productSchema);

export default productModel;

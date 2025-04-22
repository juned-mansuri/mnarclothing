import mongoose from "mongoose";

const glimpseSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    }
});

const glimpseModel = mongoose.models.glimpse || mongoose.model('Glimpse', glimpseSchema);

export default glimpseModel;
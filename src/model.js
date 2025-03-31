import mongoose from "mongoose";

const ModelSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    international: {
        type: Boolean,
        required: true,
        default: false,
    },
    method: {
        type: String,
        required: true,
    },
    vpa: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
});

export const Payment = mongoose.model("Payment", ModelSchema);

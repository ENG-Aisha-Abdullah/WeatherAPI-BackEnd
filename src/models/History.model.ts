import mongoose, { Document, Schema, Types } from 'mongoose';

export interface HistoryDocument extends Document {
    // _id: Types.ObjectId,
    user: Types.ObjectId;
    weather: Types.ObjectId;
    lat: number;
    lon: number;
    requestedAt: Date;
}

const HistorySchema = new Schema<HistoryDocument>(
    {

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
            required: true
        },
        
        weather: {
            type: Schema.Types.ObjectId,
            ref: 'Weather',
            required: true
        },
        lat: {
            type: Number,
            required: true
        },
        lon: {
            type: Number,
            required: true
        },
        requestedAt: {
            type: Date,
            default: Date.now,
            index: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<HistoryDocument>('History', HistorySchema);

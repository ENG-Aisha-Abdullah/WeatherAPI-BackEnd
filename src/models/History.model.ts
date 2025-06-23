import mongoose, { Document, Schema, Types } from 'mongoose';

export interface HistoryDocument extends Document {
  user: Types.ObjectId;
  weather: Types.ObjectId;
  lat: number;
  lon: number;
  requestedAt: Date;
  data: {
    source: string;
    tempC: number;
    description: string;
  };
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
    },
    data: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true 
  }
);

HistorySchema.index({ user: 1, requestedAt: -1 });

export default mongoose.model<HistoryDocument>('History', HistorySchema);

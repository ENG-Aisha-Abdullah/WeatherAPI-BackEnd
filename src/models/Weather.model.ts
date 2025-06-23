import mongoose, { Document, Schema, Types } from 'mongoose';
export interface WeatherDocument extends Document {
    lat: Number,                 // rounded(2)
    lon: Number,
    data: mongoose.Schema.Types.Mixed, // raw OpenWeather JSON
    fetchedAt: Date               // TTL-indexed
}

const WeatherSchema = new Schema<WeatherDocument>(
    {
        lat: {
            type: Number,
            required: true
        },
        lon: {
            type: Number,
            required: true
        },
        data: {
            type: Schema.Types.Mixed,
            required: true
        },
        fetchedAt: {
            type: Date,
            default: Date.now,
            index: { expires: '1h' } // TTL-indexed >> Time-To-Live index  >>>
        }
    }
);

export default mongoose.model<WeatherDocument>('Weather', WeatherSchema);
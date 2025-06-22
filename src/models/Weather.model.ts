// Weather – cached current conditions
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
            required: true,
            index: { expires: '1h' } // TTL-indexed >> Time-To-Live index  >>>
            // (index) هو نوع خاص من الفهارس 
            // تلقائيًا بعد وقت معين (documents) يتم استخدامه لحذف الوثائق 
        }
    }
);

export default mongoose.model<WeatherDocument>('Weather', WeatherSchema);
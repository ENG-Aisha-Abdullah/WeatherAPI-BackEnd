import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
    email: string
    passwordHash: string
    role: "user" | "admin"
    createdAt: Date
    updatedAt: Date
}
const UserSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            unique: true,
            trim: true,
            required: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        return next();
    } catch (error: any) {
        return next(error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const UsersCollection = model<UserDocument>('User', UserSchema); 
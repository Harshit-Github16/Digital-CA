import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  balance: number;
  description?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>({
  name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['asset', 'liability', 'equity', 'income', 'expense'],
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  date: Date;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  account: string;
  reference?: string;
  tags?: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  account: {
    type: String,
    required: [true, 'Account is required'],
    trim: true
  },
  reference: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

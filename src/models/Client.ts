import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
  gstin?: string;
  pan?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  businessType: string;
  registrationDate: Date;
  isActive: boolean;
  assignedTo: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function (v: string) {
        // Remove all non-digits and check if it's 10 digits starting with 6-9
        const cleaned = v.replace(/\D/g, '');
        return /^[6-9]\d{9}$/.test(cleaned);
      },
      message: 'Please enter a valid 10-digit phone number starting with 6-9'
    }
  },
  gstin: {
    type: String,
    trim: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GSTIN']
  },
  pan: {
    type: String,
    trim: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN']
  },
  address: {
    street: { type: String, required: false, default: '' },
    city: { type: String, required: false, default: '' },
    state: { type: String, required: false, default: '' },
    pincode: { type: String, required: false, default: '' },
    country: { type: String, default: 'India' }
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: ['Individual', 'Partnership', 'Company', 'LLP', 'HUF', 'Trust', 'Society']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

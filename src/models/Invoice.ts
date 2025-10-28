import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  hsnCode?: string;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  client: mongoose.Types.ObjectId;
  date: Date;
  dueDate: Date;
  items: IInvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  notes?: string;
  irn?: string;
  qrCode?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, required: true, min: 0, max: 100 },
  taxAmount: { type: Number, required: true, min: 0 },
  hsnCode: String
});

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  items: [InvoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxAmount: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  notes: String,
  irn: String,
  qrCode: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate invoice number
InvoiceSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

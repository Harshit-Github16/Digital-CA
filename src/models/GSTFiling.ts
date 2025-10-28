import mongoose, { Document, Schema } from 'mongoose';

export interface IGSTFiling extends Document {
  client: mongoose.Types.ObjectId;
  filingType: 'GSTR-1' | 'GSTR-3B' | 'GSTR-9' | 'GSTR-9C';
  taxPeriod: string; // Format: YYYY-MM
  dueDate: Date;
  filingDate?: Date;
  status: 'pending' | 'filed' | 'late' | 'cancelled';
  totalTaxLiability: number;
  totalITC: number;
  netTaxPayable: number;
  lateFee: number;
  penalty: number;
  arn?: string;
  acknowledgmentNumber?: string;
  filingData: {
    sales: {
      taxable: number;
      exempt: number;
      nilRated: number;
      nonGST: number;
    };
    purchases: {
      taxable: number;
      exempt: number;
      nilRated: number;
      nonGST: number;
    };
    itc: {
      igst: number;
      cgst: number;
      sgst: number;
      cess: number;
    };
    outputTax: {
      igst: number;
      cgst: number;
      sgst: number;
      cess: number;
    };
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GSTFilingSchema = new Schema<IGSTFiling>({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  filingType: {
    type: String,
    enum: ['GSTR-1', 'GSTR-3B', 'GSTR-9', 'GSTR-9C'],
    required: true
  },
  taxPeriod: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}$/, 'Tax period must be in YYYY-MM format']
  },
  dueDate: {
    type: Date,
    required: true
  },
  filingDate: Date,
  status: {
    type: String,
    enum: ['pending', 'filed', 'late', 'cancelled'],
    default: 'pending'
  },
  totalTaxLiability: {
    type: Number,
    default: 0,
    min: 0
  },
  totalITC: {
    type: Number,
    default: 0,
    min: 0
  },
  netTaxPayable: {
    type: Number,
    default: 0
  },
  lateFee: {
    type: Number,
    default: 0,
    min: 0
  },
  penalty: {
    type: Number,
    default: 0,
    min: 0
  },
  arn: String,
  acknowledgmentNumber: String,
  filingData: {
    sales: {
      taxable: { type: Number, default: 0 },
      exempt: { type: Number, default: 0 },
      nilRated: { type: Number, default: 0 },
      nonGST: { type: Number, default: 0 }
    },
    purchases: {
      taxable: { type: Number, default: 0 },
      exempt: { type: Number, default: 0 },
      nilRated: { type: Number, default: 0 },
      nonGST: { type: Number, default: 0 }
    },
    itc: {
      igst: { type: Number, default: 0 },
      cgst: { type: Number, default: 0 },
      sgst: { type: Number, default: 0 },
      cess: { type: Number, default: 0 }
    },
    outputTax: {
      igst: { type: Number, default: 0 },
      cgst: { type: Number, default: 0 },
      sgst: { type: Number, default: 0 },
      cess: { type: Number, default: 0 }
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate net tax payable before saving
GSTFilingSchema.pre('save', function(next) {
  this.netTaxPayable = this.totalTaxLiability - this.totalITC + this.lateFee + this.penalty;
  next();
});

export default mongoose.models.GSTFiling || mongoose.model<IGSTFiling>('GSTFiling', GSTFilingSchema);

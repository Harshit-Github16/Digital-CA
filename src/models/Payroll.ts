import mongoose, { Document, Schema } from 'mongoose';

export interface IPayroll extends Document {
  employee: mongoose.Types.ObjectId;
  month: string; // Format: YYYY-MM
  year: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  grossSalary: number;
  deductions: {
    tds: number;
    pf: number;
    esi: number;
    professionalTax: number;
    other: number;
    total: number;
  };
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  paymentDate?: Date;
  payslipGenerated: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollSchema = new Schema<IPayroll>({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  },
  year: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  hra: {
    type: Number,
    required: true,
    min: 0
  },
  allowances: {
    type: Number,
    required: true,
    min: 0
  },
  grossSalary: {
    type: Number,
    required: true,
    min: 0
  },
  deductions: {
    tds: { type: Number, default: 0, min: 0 },
    pf: { type: Number, default: 0, min: 0 },
    esi: { type: Number, default: 0, min: 0 },
    professionalTax: { type: Number, default: 0, min: 0 },
    other: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 }
  },
  netSalary: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'approved', 'paid'],
    default: 'draft'
  },
  paymentDate: Date,
  payslipGenerated: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate gross salary
PayrollSchema.pre('save', function(next) {
  this.grossSalary = this.basicSalary + this.hra + this.allowances;
  next();
});

// Calculate total deductions
PayrollSchema.pre('save', function(next) {
  this.deductions.total = this.deductions.tds + this.deductions.pf + this.deductions.esi + 
                         this.deductions.professionalTax + this.deductions.other;
  next();
});

// Calculate net salary
PayrollSchema.pre('save', function(next) {
  this.netSalary = this.grossSalary - this.deductions.total;
  next();
});

export default mongoose.models.Payroll || mongoose.model<IPayroll>('Payroll', PayrollSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  joiningDate: Date;
  salary: {
    basic: number;
    hra: number;
    allowances: number;
    total: number;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  pan?: string;
  aadhar?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid phone number']
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required']
  },
  salary: {
    basic: { type: Number, required: true, min: 0 },
    hra: { type: Number, required: true, min: 0 },
    allowances: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  bankDetails: {
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true }
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  pan: {
    type: String,
    trim: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN']
  },
  aadhar: {
    type: String,
    trim: true,
    match: [/^\d{12}$/, 'Please enter a valid Aadhar number']
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

// Auto-generate employee ID
EmployeeSchema.pre('save', async function(next) {
  if (this.isNew && !this.employeeId) {
    const count = await this.constructor.countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Calculate total salary
EmployeeSchema.pre('save', function(next) {
  this.salary.total = this.salary.basic + this.salary.hra + this.salary.allowances;
  next();
});

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

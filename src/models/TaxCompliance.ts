import mongoose, { Document, Schema } from 'mongoose';

export interface ITaxCompliance extends Document {
    client: mongoose.Types.ObjectId;
    taxType: 'Income Tax' | 'TDS' | 'Advance Tax' | 'Professional Tax' | 'Property Tax';
    assessmentYear: string;
    formType: string;
    dueDate: Date;
    filingDate?: Date;
    status: 'pending' | 'filed' | 'late' | 'cancelled' | 'under_scrutiny';
    taxAmount: number;
    penalty: number;
    interest: number;
    totalPayable: number;
    acknowledgmentNumber?: string;
    challanNumber?: string;
    refundAmount?: number;
    notes?: string;
    documents: {
        name: string;
        url: string;
        uploadedAt: Date;
    }[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TaxComplianceSchema = new Schema<ITaxCompliance>({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    taxType: {
        type: String,
        enum: ['Income Tax', 'TDS', 'Advance Tax', 'Professional Tax', 'Property Tax'],
        required: true
    },
    assessmentYear: {
        type: String,
        required: true,
        match: [/^\d{4}-\d{2}$/, 'Assessment year must be in YYYY-YY format (e.g., 2024-25)']
    },
    formType: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    filingDate: Date,
    status: {
        type: String,
        enum: ['pending', 'filed', 'late', 'cancelled', 'under_scrutiny'],
        default: 'pending'
    },
    taxAmount: {
        type: Number,
        required: true,
        min: 0
    },
    penalty: {
        type: Number,
        default: 0,
        min: 0
    },
    interest: {
        type: Number,
        default: 0,
        min: 0
    },
    totalPayable: {
        type: Number,
        required: true,
        min: 0
    },
    acknowledgmentNumber: String,
    challanNumber: String,
    refundAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot be more than 1000 characters']
    },
    documents: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Calculate total payable before saving
TaxComplianceSchema.pre('save', function (next) {
    this.totalPayable = this.taxAmount + this.penalty + this.interest - (this.refundAmount || 0);
    next();
});

export default mongoose.models.TaxCompliance || mongoose.model<ITaxCompliance>('TaxCompliance', TaxComplianceSchema);
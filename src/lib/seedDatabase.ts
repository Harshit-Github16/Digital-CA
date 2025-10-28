import connectDB from './mongodb';
import Client from '@/models/Client';
import Invoice from '@/models/Invoice';
import GSTFiling from '@/models/GSTFiling';
import TaxCompliance from '@/models/TaxCompliance';
import User from '@/models/User';

export async function seedDatabase() {
    try {
        await connectDB();

        // Clear existing data to ensure fresh seed
        console.log('Clearing existing data...');
        await Promise.all([
            Client.deleteMany({}),
            Invoice.deleteMany({}),
            GSTFiling.deleteMany({}),
            TaxCompliance.deleteMany({}),
            User.deleteMany({})
        ]);
        console.log('Existing data cleared');

        // Create a default user if none exists
        let defaultUser = await User.findOne();
        if (!defaultUser) {
            defaultUser = new User({
                name: 'Admin User',
                email: 'admin@digitalca.com',
                password: 'hashedpassword123', // This will be automatically hashed by the User model
                role: 'admin',
                isActive: true
            });
            await defaultUser.save();
        }

        // Sample clients data
        const clientsData = [
            {
                name: 'Rajesh Kumar',
                email: 'rajesh@techcorp.com',
                phone: '9876543210',
                gstin: '29ABCDE1234F1Z5',
                pan: 'ABCDE1234F',
                address: {
                    street: '123 Tech Park, Electronic City',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    pincode: '560100',
                    country: 'India'
                },
                businessType: 'Company',
                notes: 'Software development company, regular client',
                assignedTo: defaultUser._id
            },
            {
                name: 'Priya Sharma',
                email: 'priya@retailstore.com',
                phone: '8765432109',
                gstin: '07FGHIJ5678K2L6',
                pan: 'FGHIJ5678K',
                address: {
                    street: '456 Mall Road, Connaught Place',
                    city: 'New Delhi',
                    state: 'Delhi',
                    pincode: '110001',
                    country: 'India'
                },
                businessType: 'Partnership',
                notes: 'Retail business, needs regular GST filing',
                assignedTo: defaultUser._id
            },
            {
                name: 'Amit Patel Manufacturing Pvt Ltd',
                email: 'amit@manufacturing.com',
                phone: '7654321098',
                gstin: '24KLMNO9012P3M7',
                pan: 'KLMNO9012P',
                address: {
                    street: '789 Industrial Area, GIDC',
                    city: 'Ahmedabad',
                    state: 'Gujarat',
                    pincode: '380015',
                    country: 'India'
                },
                businessType: 'Company',
                notes: 'Manufacturing company with multiple locations',
                assignedTo: defaultUser._id
            },
            {
                name: 'Sunita Reddy Consulting',
                email: 'sunita@consulting.com',
                phone: '6543210987',
                gstin: '36QRSTU3456V4N8',
                pan: 'QRSTU3456V',
                address: {
                    street: '321 Business Center, Banjara Hills',
                    city: 'Hyderabad',
                    state: 'Telangana',
                    pincode: '500034',
                    country: 'India'
                },
                businessType: 'LLP',
                notes: 'Professional consulting services',
                assignedTo: defaultUser._id
            },
            {
                name: 'Vikram Singh Logistics',
                email: 'vikram@logistics.com',
                phone: '5432109876',
                gstin: '27WXYZA7890B5O9',
                pan: 'WXYZA7890B',
                address: {
                    street: '654 Transport Hub, Andheri East',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400069',
                    country: 'India'
                },
                businessType: 'Partnership',
                notes: 'Transportation and logistics services',
                assignedTo: defaultUser._id
            },
            {
                name: 'Meera Nair Textiles',
                email: 'meera@textiles.com',
                phone: '4321098765',
                gstin: '32BCDEF2345G6H1',
                pan: 'BCDEF2345G',
                address: {
                    street: '987 Textile Market, Ernakulam',
                    city: 'Kochi',
                    state: 'Kerala',
                    pincode: '682016',
                    country: 'India'
                },
                businessType: 'Individual',
                notes: 'Textile trading business',
                assignedTo: defaultUser._id
            }
        ];

        // Create clients
        const clients = await Client.insertMany(clientsData);
        console.log(`Created ${clients.length} clients`);

        // Sample invoices data
        const invoicesData = [
            {
                invoiceNumber: 'INV-2024-0001',
                client: clients[0]._id,
                date: new Date('2024-01-15'),
                dueDate: new Date('2024-02-15'),
                items: [
                    {
                        description: 'Software Development Services - January 2024',
                        quantity: 40,
                        rate: 2500,
                        amount: 100000,
                        taxRate: 18,
                        taxAmount: 18000,
                        hsnCode: '998314'
                    }
                ],
                subtotal: 100000,
                taxAmount: 18000,
                total: 118000,
                status: 'paid',
                paymentTerms: 'Net 30',
                notes: 'Monthly retainer for software development services',
                createdBy: defaultUser._id
            },
            {
                invoiceNumber: 'INV-2024-0002',
                client: clients[1]._id,
                date: new Date('2024-01-20'),
                dueDate: new Date('2024-02-20'),
                items: [
                    {
                        description: 'GST Filing Services - GSTR-1 & GSTR-3B',
                        quantity: 1,
                        rate: 5000,
                        amount: 5000,
                        taxRate: 18,
                        taxAmount: 900,
                        hsnCode: '998313'
                    }
                ],
                subtotal: 5000,
                taxAmount: 900,
                total: 5900,
                status: 'sent',
                paymentTerms: 'Net 15',
                notes: 'Monthly GST return filing services',
                createdBy: defaultUser._id
            },
            {
                invoiceNumber: 'INV-2024-0003',
                client: clients[2]._id,
                date: new Date('2024-02-01'),
                dueDate: new Date('2024-03-01'),
                items: [
                    {
                        description: 'Accounting & Bookkeeping Services',
                        quantity: 1,
                        rate: 15000,
                        amount: 15000,
                        taxRate: 18,
                        taxAmount: 2700,
                        hsnCode: '998313'
                    },
                    {
                        description: 'Tax Consultation',
                        quantity: 2,
                        rate: 3000,
                        amount: 6000,
                        taxRate: 18,
                        taxAmount: 1080,
                        hsnCode: '998313'
                    }
                ],
                subtotal: 21000,
                taxAmount: 3780,
                total: 24780,
                status: 'draft',
                paymentTerms: 'Net 30',
                notes: 'Monthly accounting services and tax consultation',
                createdBy: defaultUser._id
            }
        ];

        // Create invoices
        const invoices = await Invoice.insertMany(invoicesData);
        console.log(`Created ${invoices.length} invoices`);

        // Sample GST filings data
        const gstFilingsData = [
            {
                client: clients[0]._id,
                filingType: 'GSTR-1',
                taxPeriod: '2024-01',
                dueDate: new Date('2024-02-11'),
                filingDate: new Date('2024-02-10'),
                status: 'filed',
                totalTaxLiability: 18000,
                totalITC: 2000,
                netTaxPayable: 16000,
                lateFee: 0,
                penalty: 0,
                arn: 'AA291220241234567',
                acknowledgmentNumber: 'ACK-GSTR1-2024-001',
                filingData: {
                    sales: { taxable: 100000, exempt: 0, nilRated: 0, nonGST: 0 },
                    purchases: { taxable: 10000, exempt: 0, nilRated: 0, nonGST: 0 },
                    itc: { igst: 0, cgst: 1000, sgst: 1000, cess: 0 },
                    outputTax: { igst: 0, cgst: 9000, sgst: 9000, cess: 0 }
                },
                createdBy: defaultUser._id
            },
            {
                client: clients[1]._id,
                filingType: 'GSTR-3B',
                taxPeriod: '2024-01',
                dueDate: new Date('2024-02-20'),
                status: 'pending',
                totalTaxLiability: 900,
                totalITC: 100,
                netTaxPayable: 800,
                lateFee: 0,
                penalty: 0,
                filingData: {
                    sales: { taxable: 5000, exempt: 0, nilRated: 0, nonGST: 0 },
                    purchases: { taxable: 500, exempt: 0, nilRated: 0, nonGST: 0 },
                    itc: { igst: 0, cgst: 50, sgst: 50, cess: 0 },
                    outputTax: { igst: 0, cgst: 450, sgst: 450, cess: 0 }
                },
                createdBy: defaultUser._id
            },
            {
                client: clients[2]._id,
                filingType: 'GSTR-1',
                taxPeriod: '2024-01',
                dueDate: new Date('2024-02-11'),
                filingDate: new Date('2024-02-13'),
                status: 'late',
                totalTaxLiability: 3780,
                totalITC: 500,
                netTaxPayable: 3480,
                lateFee: 200,
                penalty: 100,
                arn: 'AA242420241234568',
                acknowledgmentNumber: 'ACK-GSTR1-2024-003',
                filingData: {
                    sales: { taxable: 21000, exempt: 0, nilRated: 0, nonGST: 0 },
                    purchases: { taxable: 2500, exempt: 0, nilRated: 0, nonGST: 0 },
                    itc: { igst: 0, cgst: 250, sgst: 250, cess: 0 },
                    outputTax: { igst: 0, cgst: 1890, sgst: 1890, cess: 0 }
                },
                createdBy: defaultUser._id
            },
            {
                client: clients[3]._id,
                filingType: 'GSTR-3B',
                taxPeriod: '2024-02',
                dueDate: new Date('2024-03-20'),
                status: 'pending',
                totalTaxLiability: 12000,
                totalITC: 1500,
                netTaxPayable: 10500,
                lateFee: 0,
                penalty: 0,
                filingData: {
                    sales: { taxable: 66667, exempt: 0, nilRated: 0, nonGST: 0 },
                    purchases: { taxable: 8333, exempt: 0, nilRated: 0, nonGST: 0 },
                    itc: { igst: 0, cgst: 750, sgst: 750, cess: 0 },
                    outputTax: { igst: 0, cgst: 6000, sgst: 6000, cess: 0 }
                },
                createdBy: defaultUser._id
            },
            {
                client: clients[4]._id,
                filingType: 'GSTR-1',
                taxPeriod: '2024-02',
                dueDate: new Date('2024-03-11'),
                filingDate: new Date('2024-03-09'),
                status: 'filed',
                totalTaxLiability: 7200,
                totalITC: 900,
                netTaxPayable: 6300,
                lateFee: 0,
                penalty: 0,
                arn: 'AA272720241234569',
                acknowledgmentNumber: 'ACK-GSTR1-2024-004',
                filingData: {
                    sales: { taxable: 40000, exempt: 0, nilRated: 0, nonGST: 0 },
                    purchases: { taxable: 5000, exempt: 0, nilRated: 0, nonGST: 0 },
                    itc: { igst: 0, cgst: 450, sgst: 450, cess: 0 },
                    outputTax: { igst: 0, cgst: 3600, sgst: 3600, cess: 0 }
                },
                createdBy: defaultUser._id
            },
            {
                client: clients[5]._id,
                filingType: 'GSTR-9',
                taxPeriod: '2023-24',
                dueDate: new Date('2024-12-31'),
                status: 'pending',
                totalTaxLiability: 45000,
                totalITC: 5000,
                netTaxPayable: 40000,
                lateFee: 0,
                penalty: 0,
                filingData: {
                    sales: { taxable: 250000, exempt: 0, nilRated: 0, nonGST: 0 },
                    purchases: { taxable: 27778, exempt: 0, nilRated: 0, nonGST: 0 },
                    itc: { igst: 0, cgst: 2500, sgst: 2500, cess: 0 },
                    outputTax: { igst: 0, cgst: 22500, sgst: 22500, cess: 0 }
                },
                createdBy: defaultUser._id
            },
            {
                client: clients[0]._id,
                filingType: 'GSTR-3B',
                taxPeriod: '2024-02',
                dueDate: new Date('2024-03-20'),
                filingDate: new Date('2024-03-18'),
                status: 'filed',
                totalTaxLiability: 19800,
                totalITC: 2200,
                netTaxPayable: 17600,
                lateFee: 0,
                penalty: 0,
                arn: 'AA291220241234570',
                acknowledgmentNumber: 'ACK-GSTR3B-2024-002',
                filingData: {
                    sales: { taxable: 110000, exempt: 0, nilRated: 0, nonGST: 0 },
                    purchases: { taxable: 12222, exempt: 0, nilRated: 0, nonGST: 0 },
                    itc: { igst: 0, cgst: 1100, sgst: 1100, cess: 0 },
                    outputTax: { igst: 0, cgst: 9900, sgst: 9900, cess: 0 }
                },
                createdBy: defaultUser._id
            },
            {
                client: clients[1]._id,
                filingType: 'GSTR-1',
                taxPeriod: '2024-02',
                dueDate: new Date('2024-03-11'),
                status: 'pending',
                totalTaxLiability: 1080,
                totalITC: 120,
                netTaxPayable: 960,
                lateFee: 0,
                penalty: 0,
                filingData: {
                    sales: { taxable: 6000, exempt: 0, nilRated: 0, nonGST: 0 },
                    purchases: { taxable: 667, exempt: 0, nilRated: 0, nonGST: 0 },
                    itc: { igst: 0, cgst: 60, sgst: 60, cess: 0 },
                    outputTax: { igst: 0, cgst: 540, sgst: 540, cess: 0 }
                },
                createdBy: defaultUser._id
            }
        ];

        // Create GST filings
        const gstFilings = await GSTFiling.insertMany(gstFilingsData);
        console.log(`Created ${gstFilings.length} GST filings`);

        // Sample tax compliance data
        const taxComplianceData = [
            {
                client: clients[0]._id,
                taxType: 'Income Tax',
                assessmentYear: '2024-25',
                formType: 'ITR-4',
                dueDate: new Date('2024-07-31'),
                filingDate: new Date('2024-07-15'),
                status: 'filed',
                taxAmount: 50000,
                penalty: 0,
                interest: 0,
                totalPayable: 50000,
                acknowledgmentNumber: 'ITR1234567890123456',
                challanNumber: 'CHL-280-2024-001',
                notes: 'Income tax return filed for AY 2024-25',
                documents: [],
                createdBy: defaultUser._id
            },
            {
                client: clients[1]._id,
                taxType: 'TDS',
                assessmentYear: '2024-25',
                formType: '24Q',
                dueDate: new Date('2024-04-15'),
                status: 'pending',
                taxAmount: 5000,
                penalty: 0,
                interest: 0,
                totalPayable: 5000,
                notes: 'TDS return for Q4 FY 2023-24',
                documents: [],
                createdBy: defaultUser._id
            },
            {
                client: clients[2]._id,
                taxType: 'Advance Tax',
                assessmentYear: '2024-25',
                formType: 'ITNS-280',
                dueDate: new Date('2024-03-15'),
                filingDate: new Date('2024-03-20'),
                status: 'late',
                taxAmount: 25000,
                penalty: 1000,
                interest: 500,
                totalPayable: 26500,
                challanNumber: 'CHL-280-2024-002',
                notes: 'Advance tax payment - Q4 with late fee',
                documents: [],
                createdBy: defaultUser._id
            }
        ];

        // Create tax compliance records
        const taxCompliance = await TaxCompliance.insertMany(taxComplianceData);
        console.log(`Created ${taxCompliance.length} tax compliance records`);

        // Sample transactions data
        const transactionsData = [
            {
                date: new Date('2024-01-15'),
                description: 'Office Rent Payment',
                category: 'Rent',
                type: 'expense',
                amount: 25000,
                account: 'Bank Account',
                reference: 'RENT-001',
                tags: ['office', 'monthly'],
                createdBy: defaultUser._id
            },
            {
                date: new Date('2024-01-16'),
                description: 'Client Payment Received - TechCorp',
                category: 'Client Revenue',
                type: 'income',
                amount: 118000,
                account: 'Bank Account',
                reference: 'INV-2024-0001',
                tags: ['client', 'revenue'],
                createdBy: defaultUser._id
            },
            {
                date: new Date('2024-01-20'),
                description: 'Software License Renewal',
                category: 'Software',
                type: 'expense',
                amount: 12000,
                account: 'Bank Account',
                reference: 'SOFT-001',
                tags: ['software', 'annual'],
                createdBy: defaultUser._id
            },
            {
                date: new Date('2024-01-25'),
                description: 'GST Filing Service Revenue',
                category: 'Service Revenue',
                type: 'income',
                amount: 5900,
                account: 'Bank Account',
                reference: 'INV-2024-0002',
                tags: ['gst', 'revenue'],
                createdBy: defaultUser._id
            },
            {
                date: new Date('2024-02-01'),
                description: 'Office Supplies Purchase',
                category: 'Office Supplies',
                type: 'expense',
                amount: 3500,
                account: 'Bank Account',
                reference: 'SUP-001',
                tags: ['office', 'supplies'],
                createdBy: defaultUser._id
            },
            {
                date: new Date('2024-02-05'),
                description: 'Internet & Phone Bills',
                category: 'Utilities',
                type: 'expense',
                amount: 4500,
                account: 'Bank Account',
                reference: 'UTIL-001',
                tags: ['utilities', 'monthly'],
                createdBy: defaultUser._id
            },
            {
                date: new Date('2024-02-10'),
                description: 'Consulting Service Revenue',
                category: 'Service Revenue',
                type: 'income',
                amount: 24780,
                account: 'Bank Account',
                reference: 'INV-2024-0003',
                tags: ['consulting', 'revenue'],
                createdBy: defaultUser._id
            },
            {
                date: new Date('2024-02-15'),
                description: 'Professional Development Course',
                category: 'Professional Services',
                type: 'expense',
                amount: 8000,
                account: 'Bank Account',
                reference: 'PROF-001',
                tags: ['training', 'development'],
                createdBy: defaultUser._id
            }
        ];

        // Create transactions
        const Transaction = (await import('@/models/Transaction')).default;
        const transactions = await Transaction.insertMany(transactionsData);
        console.log(`Created ${transactions.length} transactions`);

        console.log('Database seeded successfully!');
        return {
            clients: clients.length,
            invoices: invoices.length,
            gstFilings: gstFilings.length,
            taxCompliance: taxCompliance.length,
            transactions: transactions.length
        };

    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}
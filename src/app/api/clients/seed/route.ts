import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Get or create a default user
        let defaultUser = await User.findOne();
        if (!defaultUser) {
            defaultUser = new User({
                name: 'Admin User',
                email: 'admin@digitalca.com',
                password: 'hashedpassword123', // In real app, this would be properly hashed
                role: 'admin',
                isActive: true
            });
            await defaultUser.save();
        }

        // Enhanced client data with more realistic information
        const clientsData = [
            {
                name: 'Rajesh Kumar Tech Solutions Pvt Ltd',
                email: 'rajesh@techsolutions.com',
                phone: '9876543210',
                gstin: '29ABCDE1234F1Z5',
                pan: 'ABCDE1234F',
                address: {
                    street: '123 Tech Park, Electronic City Phase 1',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    pincode: '560100',
                    country: 'India'
                },
                businessType: 'Company',
                notes: 'Software development company specializing in web applications. Regular monthly retainer client.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Priya Sharma Retail Enterprises',
                email: 'priya@retailenterprises.com',
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
                notes: 'Multi-brand retail store chain. Needs regular GST filing and inventory management support.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Amit Patel Manufacturing Industries',
                email: 'amit@patelmanufacturing.com',
                phone: '7654321098',
                gstin: '24KLMNO9012P3M7',
                pan: 'KLMNO9012P',
                address: {
                    street: '789 Industrial Area, GIDC Vatva',
                    city: 'Ahmedabad',
                    state: 'Gujarat',
                    pincode: '380015',
                    country: 'India'
                },
                businessType: 'Company',
                notes: 'Textile manufacturing company with multiple production units. Complex GST requirements.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Sunita Reddy Consulting Services LLP',
                email: 'sunita@reddyconsulting.com',
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
                notes: 'Management consulting firm. Provides services to Fortune 500 companies.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Vikram Singh Logistics Pvt Ltd',
                email: 'vikram@singhlogistics.com',
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
                businessType: 'Company',
                notes: 'Pan-India logistics and transportation services. Fleet of 200+ vehicles.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Meera Nair Textiles & Exports',
                email: 'meera@nairtextiles.com',
                phone: '4321098765',
                gstin: '32BCDEF2345G6H1',
                pan: 'BCDEF2345G',
                address: {
                    street: '987 Textile Market, Marine Drive',
                    city: 'Kochi',
                    state: 'Kerala',
                    pincode: '682016',
                    country: 'India'
                },
                businessType: 'Individual',
                notes: 'Traditional textile business with export operations to Middle East and Europe.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Arjun Gupta Digital Marketing Agency',
                email: 'arjun@guptadigital.com',
                phone: '3210987654',
                gstin: '10HIJKL6789M0N2',
                pan: 'HIJKL6789M',
                address: {
                    street: '111 Cyber City, Sector 24',
                    city: 'Gurgaon',
                    state: 'Haryana',
                    pincode: '122002',
                    country: 'India'
                },
                businessType: 'Partnership',
                notes: 'Full-service digital marketing agency. Handles social media and SEO for 50+ clients.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Kavya Iyer Food Processing Unit',
                email: 'kavya@iyerfoodprocessing.com',
                phone: '2109876543',
                gstin: '33OPQRS1234T5U6',
                pan: 'OPQRS1234T',
                address: {
                    street: '222 Food Park, Hosur Road',
                    city: 'Chennai',
                    state: 'Tamil Nadu',
                    pincode: '600068',
                    country: 'India'
                },
                businessType: 'Company',
                notes: 'Organic food processing and packaging. FSSAI certified with nationwide distribution.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Rohit Sharma Construction & Builders',
                email: 'rohit@sharmabuilders.com',
                phone: '1098765432',
                gstin: '23VWXYZ7890A1B2',
                pan: 'VWXYZ7890A',
                address: {
                    street: '333 Builder Colony, Baner',
                    city: 'Pune',
                    state: 'Maharashtra',
                    pincode: '411045',
                    country: 'India'
                },
                businessType: 'Partnership',
                notes: 'Real estate development and construction. Currently working on 5 residential projects.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Anita Joshi Pharmaceutical Distributors',
                email: 'anita@joshipharma.com',
                phone: '0987654321',
                gstin: '05CDEFG3456H7I8',
                pan: 'CDEFG3456H',
                address: {
                    street: '444 Medical Complex, Civil Lines',
                    city: 'Jaipur',
                    state: 'Rajasthan',
                    pincode: '302006',
                    country: 'India'
                },
                businessType: 'Company',
                notes: 'Pharmaceutical wholesale distribution. Licensed distributor for major pharma companies.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Deepak Agarwal Import Export',
                email: 'deepak@agarwalimex.com',
                phone: '9876501234',
                gstin: '19IJKLM9012N3O4',
                pan: 'IJKLM9012N',
                address: {
                    street: '555 Export House, Nehru Place',
                    city: 'New Delhi',
                    state: 'Delhi',
                    pincode: '110019',
                    country: 'India'
                },
                businessType: 'Individual',
                notes: 'Import-export business dealing in electronics and machinery. Regular international transactions.',
                assignedTo: defaultUser._id
            },
            {
                name: 'Sita Devi Handicrafts Emporium',
                email: 'sita@handicraftsemporium.com',
                phone: '8765012345',
                gstin: '09PQRST5678U9V0',
                pan: 'PQRST5678U',
                address: {
                    street: '666 Handicraft Market, Charminar',
                    city: 'Hyderabad',
                    state: 'Telangana',
                    pincode: '500002',
                    country: 'India'
                },
                businessType: 'Individual',
                notes: 'Traditional handicrafts and artifacts. Supplies to hotels and export houses.',
                assignedTo: defaultUser._id
            }
        ];

        // Check if clients already exist
        const existingCount = await Client.countDocuments();
        if (existingCount > 0) {
            return NextResponse.json({
                message: 'Clients already exist in database',
                count: existingCount
            });
        }

        // Insert all clients
        const clients = await Client.insertMany(clientsData);

        return NextResponse.json({
            success: true,
            message: `Successfully added ${clients.length} clients to the database`,
            clients: clients.map(client => ({
                id: client._id,
                name: client.name,
                email: client.email,
                businessType: client.businessType,
                gstin: client.gstin
            }))
        });

    } catch (error: any) {
        console.error('Seed clients error:', error);
        return NextResponse.json(
            { error: 'Failed to seed clients', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const clientCount = await Client.countDocuments();
        const clients = await Client.find().select('name email businessType gstin').limit(10);

        return NextResponse.json({
            message: 'Current clients in database',
            count: clientCount,
            clients
        });
    } catch (error: any) {
        console.error('Get clients error:', error);
        return NextResponse.json(
            { error: 'Failed to get clients', details: error.message },
            { status: 500 }
        );
    }
}
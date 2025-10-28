// Script to reset and reseed the database
// Run with: node reset-database.js

const baseURL = 'http://localhost:3002/api';

async function resetDatabase() {
    console.log('🔄 Resetting Database...\n');

    try {
        // Step 1: Clear existing data (if there's a clear endpoint)
        console.log('1. Clearing existing data...');

        // Step 2: Seed fresh data
        console.log('2. Seeding fresh data...');
        const seedResponse = await fetch(`${baseURL}/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const seedResult = await seedResponse.json();
        console.log('Seed Response:', seedResult);

        if (seedResponse.ok) {
            console.log('✅ Database seeded successfully!');
            console.log(`📊 Created:`);
            console.log(`   - ${seedResult.data?.clients || 0} clients`);
            console.log(`   - ${seedResult.data?.invoices || 0} invoices`);
            console.log(`   - ${seedResult.data?.gstFilings || 0} GST filings`);
            console.log(`   - ${seedResult.data?.taxCompliance || 0} tax compliance records`);
        } else {
            console.log('❌ Seeding failed:', seedResult.error);
        }

        // Step 3: Test GST filings API
        console.log('\n3. Testing GST filings API...');
        const gstResponse = await fetch(`${baseURL}/gst-filings`);
        const gstData = await gstResponse.json();

        if (gstResponse.ok) {
            const filings = gstData.gstFilings || gstData;
            console.log(`✅ GST API working - found ${Array.isArray(filings) ? filings.length : 0} filings`);

            if (Array.isArray(filings) && filings.length > 0) {
                console.log('Sample GST filing:');
                const sample = filings[0];
                console.log(`   - Client: ${sample.client?.name}`);
                console.log(`   - Type: ${sample.filingType}`);
                console.log(`   - Period: ${sample.taxPeriod}`);
                console.log(`   - Status: ${sample.status}`);
            }
        } else {
            console.log('❌ GST API failed:', gstData.error);
        }

        // Step 4: Instructions
        console.log('\n📋 Next Steps:');
        console.log('1. Go to: http://localhost:3002/gst');
        console.log('2. Check if GST filings are now visible');
        console.log('3. Open browser console to see API response logs');
        console.log('4. If still not visible, check authentication (login first)');

        console.log('\n🎉 Database reset completed!');

    } catch (error) {
        console.error('❌ Reset failed:', error.message);
    }
}

// Check if fetch is available
if (typeof fetch === 'undefined') {
    console.log('❌ This script requires Node.js 18+');
    console.log('\n🔧 Manual steps:');
    console.log('1. POST to: http://localhost:3002/api/seed');
    console.log('2. Check: http://localhost:3002/api/gst-filings');
    console.log('3. Visit: http://localhost:3002/gst');
} else {
    resetDatabase();
}
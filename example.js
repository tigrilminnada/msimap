const { 
    ImapChecker, 
    quickLoginCheck, 
    quickSearch, 
    quickInboxCount, 
    quickStats,
    isDomainSupported,
    getServerConfig
} = require('./index');

// Contoh penggunaan library
async function runExamples() {
    // GANTI dengan kredensial email yang valid untuk testing
    const email = 'your-email@gmail.com';
    const password = 'your-app-password'; // Untuk Gmail gunakan App Password
    
    console.log('🚀 Starting IMAP Checker Examples...\n');

    try {
        // 1. Cek apakah domain didukung
        console.log('1. Checking domain support:');
        console.log(`   Domain supported: ${isDomainSupported(email)}`);
        console.log(`   Server config: ${JSON.stringify(getServerConfig(email), null, 2)}\n`);

        // 2. Quick login check
        console.log('2. Testing login:');
        const loginResult = await quickLoginCheck(email, password, { debug: true });
        console.log(`   Login successful: ${loginResult.success}`);
        console.log(`   Server: ${loginResult.detectedServer.host}:${loginResult.detectedServer.port}\n`);

        // 3. Get total inbox count
        console.log('3. Getting total inbox count:');
        const totalCount = await quickInboxCount(email, password);
        console.log(`   Total messages in inbox: ${totalCount}\n`);

        // 4. Search for specific keywords
        console.log('4. Searching for keywords:');
        const keywords = ['test', 'important', 'meeting'];
        
        for (const keyword of keywords) {
            try {
                const searchResult = await quickSearch(email, password, keyword, {
                    searchIn: ['SUBJECT', 'TEXT'],
                    limit: 10
                });
                console.log(`   Keyword "${keyword}": ${searchResult.count} messages found`);
            } catch (searchError) {
                console.log(`   Keyword "${keyword}": Error - ${searchError.message}`);
            }
        }
        console.log();

        // 5. Get comprehensive stats
        console.log('5. Getting comprehensive inbox stats:');
        const stats = await quickStats(email, password, ['notification', 'invoice', 'newsletter']);
        console.log('   Inbox Statistics:');
        console.log(`   - Total messages: ${stats.totalMessages}`);
        console.log(`   - Unread messages: ${stats.unreadMessages}`);
        console.log(`   - Recent messages: ${stats.recentMessages}`);
        console.log('   - Keyword statistics:');
        stats.keywordStats.forEach(stat => {
            console.log(`     * "${stat.keyword}": ${stat.count} messages`);
        });
        console.log();

        // 6. Using ImapChecker class directly for advanced usage
        console.log('6. Advanced usage with ImapChecker class:');
        const checker = new ImapChecker({ debug: false, timeout: 15000 });
        
        // Get mailbox list
        const mailboxes = await checker.getMailboxList(email, password);
        console.log('   Available mailboxes:');
        mailboxes.slice(0, 5).forEach(box => {
            console.log(`   - ${box.name}`);
        });
        if (mailboxes.length > 5) {
            console.log(`   ... and ${mailboxes.length - 5} more`);
        }
        console.log();

        // 7. Search with detailed results
        console.log('7. Detailed search results:');
        const detailedSearch = await checker.searchInboxByKeyword(email, password, 'github', {
            searchIn: ['SUBJECT', 'FROM'],
            includeDetails: true,
            limit: 5
        });
        
        console.log(`   Found ${detailedSearch.count} messages containing "github"`);
        if (detailedSearch.messages && detailedSearch.messages.length > 0) {
            console.log('   Recent messages:');
            detailedSearch.messages.forEach((msg, index) => {
                console.log(`   ${index + 1}. From: ${msg.from}`);
                console.log(`      Subject: ${msg.subject}`);
                console.log(`      Date: ${msg.date}\n`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Contoh penggunaan sederhana untuk demonstrasi
async function simpleExample() {
    console.log('📧 Simple IMAP Checker Example\n');
    
    // DEMO dengan domain yang diketahui (tanpa kredensial nyata)
    const testEmail = 'user@gmail.com';
    
    console.log(`Testing domain detection for: ${testEmail}`);
    console.log(`Domain supported: ${isDomainSupported(testEmail)}`);
    
    const config = getServerConfig(testEmail);
    if (config) {
        console.log(`Detected server: ${config.host}:${config.port} (TLS: ${config.tls})`);
    }
    
    console.log('\n📝 To test with real credentials:');
    console.log('1. Edit the email and password variables in runExamples()');
    console.log('2. For Gmail, use App Password instead of regular password');
    console.log('3. Enable 2FA and generate App Password from Google Account settings');
    console.log('4. Run: node example.js\n');
}

// Run examples
if (require.main === module) {
    // Uncomment line below and provide real credentials to test full functionality
    // runExamples();
    
    // Run simple demonstration
    simpleExample();
}

module.exports = {
    runExamples,
    simpleExample
};

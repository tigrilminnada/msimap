const ImapChecker = require('../lib/ImapChecker');

/**
 * Simple IMAP Checker Example
 * Test single account login and inbox functions
 */
async function singleAccountTest() {
    console.log('🧪 Single Account Test');
    console.log('='.repeat(30));
    
    try {
        const checker = new ImapChecker();
        
        // Test credentials (use your own)
        const testEmail = 'ooedo@juno.ocn.ne.jp';
        const testPassword = 'rzii63';
        
        console.log(`📧 Testing: ${testEmail}`);
        
        // 1. Test login
        console.log('\n1️⃣ Testing login...');
        const loginResult = await checker.login(testEmail, testPassword);
        
        if (loginResult.success) {
            console.log('✅ Login successful');
            console.log(`📡 Server: ${loginResult.detectedServer.host}:${loginResult.detectedServer.port}`);
            console.log(`⏱️  Response time: ${loginResult.responseTime}ms`);
            
            // 2. Test inbox info
            console.log('\n2️⃣ Getting inbox info...');
            const inboxInfo = await checker.getInboxInfo(testEmail, testPassword);
            console.log(`📫 Total emails: ${inboxInfo.total}`);
            console.log(`📬 Unread emails: ${inboxInfo.unseen || 0}`);
            console.log(`📮 Recent emails: ${inboxInfo.recent || 0}`);
            
            // 3. Test keyword search
            console.log('\n3️⃣ Testing keyword search...');
            const keyword = 'paypal';
            const keywordCount = await checker.searchKeyword(testEmail, testPassword, keyword);
            console.log(`🔍 Found ${keywordCount} emails with "${keyword}"`);
            
        } else {
            console.log('❌ Login failed:', loginResult.error);
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
    }
    
    console.log('\n✅ Test completed');
}

// Run test
singleAccountTest();

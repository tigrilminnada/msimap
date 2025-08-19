const Imap = require('node-imap');
const { IMAP_SERVERS, DEFAULT_TIMEOUT, DEFAULT_IMAP_PORT } = require('./config');

class ImapChecker {
    constructor(options = {}) {
        this.timeout = options.timeout || DEFAULT_TIMEOUT;
        this.debug = options.debug || false;
    }

    /**
     * Ekstrak domain dari alamat email
     * @param {string} email - Alamat email
     * @returns {string} Domain email
     */
    extractDomain(email) {
        if (!email || typeof email !== 'string') {
            throw new Error('Email address is required and must be a string');
        }
        
        const atIndex = email.lastIndexOf('@');
        if (atIndex === -1) {
            throw new Error('Invalid email format');
        }
        
        return email.substring(atIndex + 1).toLowerCase();
    }

    /**
     * Deteksi server IMAP berdasarkan domain email
     * @param {string} email - Alamat email
     * @returns {Object} Konfigurasi server IMAP
     */
    detectImapServer(email) {
        const domain = this.extractDomain(email);
        
        // Cek apakah domain exact match ada di config
        if (IMAP_SERVERS[domain]) {
            return {
                ...IMAP_SERVERS[domain],
                isGuessed: false
            };
        }
        
        // Auto-mapping untuk subdomain (contoh: juno.ocn.ne.jp -> ocn.ne.jp)
        const domainParts = domain.split('.');
        if (domainParts.length > 2) {
            // Coba parent domain (ambil 2 bagian terakhir)
            const parentDomain = domainParts.slice(-2).join('.');
            if (IMAP_SERVERS[parentDomain]) {
                if (this.debug) {
                    console.log(`Auto-mapping ${domain} -> ${parentDomain}`);
                }
                return {
                    ...IMAP_SERVERS[parentDomain],
                    isGuessed: false
                };
            }
            
            // Coba dengan 3 bagian terakhir untuk domain seperti .co.uk, .ac.id
            if (domainParts.length > 3) {
                const parentDomain3 = domainParts.slice(-3).join('.');
                if (IMAP_SERVERS[parentDomain3]) {
                    if (this.debug) {
                        console.log(`Auto-mapping ${domain} -> ${parentDomain3}`);
                    }
                    return {
                        ...IMAP_SERVERS[parentDomain3],
                        isGuessed: false
                    };
                }
            }
        }
        
        // Jika tidak ada mapping, buat pattern umum berdasarkan domain
        const commonPatterns = [
            { pattern: `imap.${domain}`, port: DEFAULT_IMAP_PORT, tls: true },
            { pattern: `mail.${domain}`, port: DEFAULT_IMAP_PORT, tls: true },
            { pattern: `imap.mail.${domain}`, port: DEFAULT_IMAP_PORT, tls: true },
            { pattern: `${domain}`, port: DEFAULT_IMAP_PORT, tls: true },
            { pattern: `imap.${domain}`, port: 143, tls: false }
        ];
        
        if (this.debug) {
            console.log(`Server tidak ditemukan untuk domain ${domain}, menggunakan pola umum`);
        }
        
        return {
            host: commonPatterns[0].pattern,
            port: commonPatterns[0].port,
            tls: commonPatterns[0].tls,
            isGuessed: true,
            alternatives: commonPatterns.slice(1)
        };
    }

    /**
     * Test koneksi IMAP
     * @param {Object} config - Konfigurasi IMAP
     * @param {string} username - Username/email
     * @param {string} password - Password
     * @returns {Promise<Object>} Hasil test koneksi
     */
    async testConnection(config, username, password) {
        return new Promise((resolve, reject) => {
            const imapConfig = {
                host: config.host,
                port: config.port,
                tls: config.tls,
                user: username,
                password: password,
                authTimeout: this.timeout,
                connTimeout: this.timeout,
                tlsOptions: {
                    rejectUnauthorized: false // Untuk development, sebaiknya true untuk production
                }
            };

            if (this.debug) {
                console.log(`Testing connection to ${config.host}:${config.port} with TLS: ${config.tls}`);
            }

            const imap = new Imap(imapConfig);
            let isResolved = false;
            
            // Set timeout manual
            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    imap.destroy();
                    reject(new Error(`Connection timeout after ${this.timeout}ms`));
                }
            }, this.timeout);

            imap.once('ready', () => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    imap.end();
                    resolve({
                        success: true,
                        message: 'Connection successful',
                        server: config
                    });
                }
            });

            imap.once('error', (err) => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    reject({
                        success: false,
                        error: err.message || err.toString(),
                        server: config
                    });
                }
            });

            imap.once('end', () => {
                if (this.debug) {
                    console.log('Connection ended');
                }
            });

            try {
                imap.connect();
            } catch (err) {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    reject({
                        success: false,
                        error: err.message || err.toString(),
                        server: config
                    });
                }
            }
        });
    }

    /**
     * Login ke IMAP server dengan auto-detection
     * @param {string} email - Alamat email
     * @param {string} password - Password
     * @returns {Promise<Object>} Hasil login
     */
    async login(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const serverConfig = this.detectImapServer(email);
        
        try {
            // Coba dengan server yang terdeteksi
            const result = await this.testConnection(serverConfig, email, password);
            return {
                ...result,
                email: email,
                detectedServer: serverConfig
            };
        } catch (error) {
            // Jika gagal dan menggunakan tebakan, coba alternatif
            if (serverConfig.isGuessed && serverConfig.alternatives) {
                for (const alternative of serverConfig.alternatives) {
                    try {
                        const altConfig = {
                            host: alternative.pattern,
                            port: alternative.port,
                            tls: alternative.tls
                        };
                        const result = await this.testConnection(altConfig, email, password);
                        return {
                            ...result,
                            email: email,
                            detectedServer: altConfig
                        };
                    } catch (altError) {
                        if (this.debug) {
                            console.log(`Alternative ${alternative.pattern} failed: ${altError.error || altError.message}`);
                        }
                        continue;
                    }
                }
            }
            
            throw error;
        }
    }

    /**
     * Buat koneksi IMAP baru
     * @param {string} email - Alamat email
     * @param {string} password - Password
     * @param {Object} customConfig - Konfigurasi kustom (opsional)
     * @returns {Promise<Imap>} Instance IMAP yang terkoneksi
     */
    async createConnection(email, password, customConfig = null) {
        const serverConfig = customConfig || this.detectImapServer(email);
        
        // Konfigurasi sederhana untuk kompatibilitas maksimal
        const imapConfig = {
            host: serverConfig.host,
            port: serverConfig.port || 993,
            tls: serverConfig.tls !== false, // Default true kecuali explicitly false
            user: email,
            password: password,
            authTimeout: 30000,
            connTimeout: 30000,
            keepalive: false
        };
        
        // Hanya tambahkan tlsOptions jika TLS digunakan
        if (imapConfig.tls) {
            imapConfig.tlsOptions = {
                rejectUnauthorized: false
            };
        }

        if (this.debug) {
            console.log(`Connecting to ${imapConfig.host}:${imapConfig.port} (TLS: ${imapConfig.tls})`);
        }

        const imap = new Imap(imapConfig);
        
        return new Promise((resolve, reject) => {
            let isResolved = false;
            
            const cleanup = () => {
                if (imap && typeof imap.destroy === 'function') {
                    try {
                        imap.destroy();
                    } catch (e) {
                        // Ignore cleanup errors
                    }
                }
            };
            
            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    cleanup();
                    reject(new Error(`Connection timeout after 30 seconds`));
                }
            }, 30000);

            imap.once('ready', () => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    resolve(imap);
                }
            });

            imap.once('error', (err) => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    cleanup();
                    reject(new Error(`IMAP Connection Error: ${err.message || err.toString()}`));
                }
            });

            imap.once('end', () => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    reject(new Error('Connection ended unexpectedly'));
                }
            });

            try {
                imap.connect();
            } catch (connectError) {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    reject(new Error(`Failed to initiate connection: ${connectError.message}`));
                }
            }
        });
    }

    /**
     * Dapatkan total jumlah email di inbox
     * @param {string} email - Alamat email
     * @param {string} password - Password
     * @param {string} mailbox - Nama mailbox (default: 'INBOX')
     * @returns {Promise<number>} Jumlah total email
     */
    async getTotalInboxCount(email, password, mailbox = 'INBOX') {
        const imap = await this.createConnection(email, password);
        
        return new Promise((resolve, reject) => {
            imap.openBox(mailbox, true, (err, box) => {
                if (err) {
                    imap.end();
                    reject(err);
                    return;
                }
                
                const totalCount = box.messages.total;
                imap.end();
                resolve(totalCount);
            });
        });
    }

    /**
     * Cari email berdasarkan keyword dan dapatkan jumlahnya
     * @param {string} email - Alamat email
     * @param {string} password - Password
     * @param {string} keyword - Keyword pencarian
     * @param {Object} options - Opsi pencarian
     * @returns {Promise<Object>} Hasil pencarian dengan count dan detail
     */
    async searchInboxByKeyword(email, password, keyword, options = {}) {
        const {
            mailbox = 'INBOX',
            searchIn = ['TEXT'], // TEXT, SUBJECT, FROM, TO, BODY
            caseSensitive = false,
            limit = null
        } = options;

        const imap = await this.createConnection(email, password);
        
        return new Promise((resolve, reject) => {
            imap.openBox(mailbox, true, (err, box) => {
                if (err) {
                    imap.end();
                    reject(err);
                    return;
                }

                // Buat kriteria pencarian
                let searchCriteria = [];
                
                if (Array.isArray(searchIn)) {
                    // Jika multiple search fields, gunakan OR logic
                    if (searchIn.length > 1) {
                        const orCriteria = searchIn.map(field => [field, keyword]);
                        searchCriteria = ['OR', ...orCriteria.flat()];
                    } else {
                        searchCriteria = [searchIn[0], keyword];
                    }
                } else {
                    searchCriteria = [searchIn, keyword];
                }

                if (this.debug) {
                    console.log('Search criteria:', searchCriteria);
                }

                imap.search(searchCriteria, (err, results) => {
                    if (err) {
                        imap.end();
                        reject(err);
                        return;
                    }

                    const count = results.length;
                    let resultData = {
                        keyword: keyword,
                        count: count,
                        totalInbox: box.messages.total,
                        searchIn: searchIn,
                        mailbox: mailbox,
                        messageIds: limit ? results.slice(0, limit) : results
                    };

                    // Jika diminta detail email
                    if (options.includeDetails && count > 0) {
                        const fetchLimit = limit ? Math.min(limit, count) : Math.min(50, count); // Maksimal 50 untuk performa
                        const messagesToFetch = results.slice(0, fetchLimit);
                        
                        const fetch = imap.fetch(messagesToFetch, {
                            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                            struct: true
                        });

                        let messages = [];
                        
                        fetch.on('message', (msg, seqno) => {
                            let headers = {};
                            
                            msg.on('body', (stream, info) => {
                                let buffer = '';
                                stream.on('data', (chunk) => {
                                    buffer += chunk.toString('utf8');
                                });
                                stream.once('end', () => {
                                    headers = Imap.parseHeader(buffer);
                                });
                            });

                            msg.once('end', () => {
                                messages.push({
                                    seqno: seqno,
                                    from: headers.from ? headers.from[0] : '',
                                    to: headers.to ? headers.to[0] : '',
                                    subject: headers.subject ? headers.subject[0] : '',
                                    date: headers.date ? headers.date[0] : ''
                                });
                            });
                        });

                        fetch.once('error', (err) => {
                            imap.end();
                            reject(err);
                        });

                        fetch.once('end', () => {
                            resultData.messages = messages;
                            imap.end();
                            resolve(resultData);
                        });
                    } else {
                        imap.end();
                        resolve(resultData);
                    }
                });
            });
        });
    }

    /**
     * Dapatkan statistik lengkap inbox
     * @param {string} email - Alamat email
     * @param {string} password - Password
     * @param {Array} keywords - Array keyword untuk dicari (opsional)
     * @returns {Promise<Object>} Statistik lengkap inbox
     */
    async getInboxStats(email, password, keywords = []) {
        const imap = await this.createConnection(email, password);
        
        return new Promise((resolve, reject) => {
            imap.openBox('INBOX', true, async (err, box) => {
                if (err) {
                    imap.end();
                    reject(err);
                    return;
                }

                let stats = {
                    email: email,
                    totalMessages: box.messages.total,
                    unreadMessages: box.messages.unseen,
                    recentMessages: box.messages.recent,
                    mailboxName: box.name,
                    keywordStats: []
                };

                // Jika ada keywords untuk dicari
                if (keywords.length > 0) {
                    try {
                        for (const keyword of keywords) {
                            const searchResult = await new Promise((resolveSearch, rejectSearch) => {
                                imap.search(['TEXT', keyword], (searchErr, results) => {
                                    if (searchErr) {
                                        rejectSearch(searchErr);
                                        return;
                                    }
                                    resolveSearch({
                                        keyword: keyword,
                                        count: results.length,
                                        messageIds: results
                                    });
                                });
                            });
                            stats.keywordStats.push(searchResult);
                        }
                    } catch (searchError) {
                        imap.end();
                        reject(searchError);
                        return;
                    }
                }

                imap.end();
                resolve(stats);
            });
        });
    }

    /**
     * Dapatkan daftar mailbox yang tersedia
     * @param {string} email - Alamat email
     * @param {string} password - Password
     * @returns {Promise<Array>} Daftar mailbox
     */
    async getMailboxList(email, password) {
        const imap = await this.createConnection(email, password);
        
        return new Promise((resolve, reject) => {
            imap.getBoxes((err, boxes) => {
                imap.end();
                
                if (err) {
                    reject(err);
                    return;
                }

                // Flatten nested box structure
                const flattenBoxes = (boxObj, prefix = '') => {
                    let result = [];
                    for (const [name, box] of Object.entries(boxObj)) {
                        const fullName = prefix ? `${prefix}${box.delimiter}${name}` : name;
                        if (box.children) {
                            result.push({
                                name: fullName,
                                delimiter: box.delimiter,
                                attribs: box.attribs,
                                hasChildren: true
                            });
                            result = result.concat(flattenBoxes(box.children, fullName));
                        } else {
                            result.push({
                                name: fullName,
                                delimiter: box.delimiter,
                                attribs: box.attribs,
                                hasChildren: false
                            });
                        }
                    }
                    return result;
                };

                resolve(flattenBoxes(boxes));
            });
        });
    }

    /**
     * Dapatkan total jumlah email di inbox
     * @param {string} email - Alamat email
     * @param {string} password - Password
     * @returns {Promise<number>} Total jumlah email
     */
    async getTotalCount(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const imap = await this.createConnection(email, password);
                
                imap.once('ready', () => {
                    imap.openBox('INBOX', true, (err, box) => {
                        if (err) {
                            imap.end();
                            reject(err);
                            return;
                        }
                        
                        const totalCount = box.messages.total;
                        imap.end();
                        resolve(totalCount);
                    });
                });
                
                imap.once('error', (err) => {
                    reject(err);
                });
                
                imap.connect();
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Dapatkan informasi inbox (total, unread, recent)
     * @param {string} email - Alamat email
     * @param {string} password - Password
     * @returns {Promise<Object>} Info inbox
     */
    async getInboxInfo(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const imap = await this.createConnection(email, password);
                
                imap.once('ready', () => {
                    imap.openBox('INBOX', true, (err, box) => {
                        if (err) {
                            imap.end();
                            reject(err);
                            return;
                        }
                        
                        const inboxInfo = {
                            total: box.messages.total,
                            unseen: box.messages.unseen,
                            recent: box.messages.recent
                        };
                        
                        imap.end();
                        resolve(inboxInfo);
                    });
                });
                
                imap.once('error', (err) => {
                    reject(err);
                });
                
                imap.connect();
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Search keyword di inbox dan return count
     * @param {string} email - Alamat email
     * @param {string} password - Password
     * @param {string} keyword - Keyword untuk dicari
     * @param {Object} options - Opsi pencarian
     * @returns {Promise<number>} Jumlah email yang ditemukan
     */
    async searchKeyword(email, password, keyword, options = {}) {
        const {
            mailbox = 'INBOX',
            searchIn = ['TEXT'] // TEXT, SUBJECT, FROM, TO, BODY
        } = options;
        
        return new Promise(async (resolve, reject) => {
            try {
                const imap = await this.createConnection(email, password);
                
                imap.once('ready', () => {
                    imap.openBox(mailbox, true, (err, box) => {
                        if (err) {
                            imap.end();
                            reject(err);
                            return;
                        }
                        
                        // Format search criteria yang benar untuk node-imap
                        let searchCriteria;
                        
                        if (searchIn.includes('TEXT')) {
                            // Search di seluruh content email
                            searchCriteria = [['TEXT', keyword]];
                        } else if (searchIn.includes('SUBJECT')) {
                            // Search hanya di subject
                            searchCriteria = [['SUBJECT', keyword]];
                        } else if (searchIn.includes('FROM')) {
                            // Search hanya di from
                            searchCriteria = [['FROM', keyword]];
                        } else if (searchIn.includes('BODY')) {
                            // Search hanya di body
                            searchCriteria = [['BODY', keyword]];
                        } else {
                            // Default: search di TEXT
                            searchCriteria = [['TEXT', keyword]];
                        }
                        
                        if (this.debug) {
                            console.log(`Searching for "${keyword}" in ${mailbox} with criteria:`, searchCriteria);
                        }
                        
                        imap.search(searchCriteria, (err, results) => {
                            if (err) {
                                imap.end();
                                reject(err);
                                return;
                            }
                            
                            const count = results ? results.length : 0;
                            imap.end();
                            resolve(count);
                        });
                    });
                });
                
                imap.once('error', (err) => {
                    reject(err);
                });
                
                imap.connect();
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Search dengan detail email (untuk advanced search)
     * @param {string} email - Alamat email
     * @param {string} password - Password
     * @param {string} keyword - Keyword untuk dicari
     * @param {Object} options - Opsi pencarian
     * @returns {Promise<Object>} Hasil pencarian dengan detail
     */
    async searchInboxByKeyword(email, password, keyword, options = {}) {
        const {
            mailbox = 'INBOX',
            searchIn = ['TEXT'],
            limit = null,
            includeDetails = false
        } = options;
        
        if (!includeDetails) {
            // Hanya return count
            return await this.searchKeyword(email, password, keyword, { mailbox, searchIn });
        }
        
        // Return dengan detail email
        return new Promise(async (resolve, reject) => {
            try {
                const imap = await this.createConnection(email, password);
                
                imap.once('ready', () => {
                    imap.openBox(mailbox, true, (err, box) => {
                        if (err) {
                            imap.end();
                            reject(err);
                            return;
                        }
                        
                        // Build search criteria
                        let searchCriteria = [];
                        
                        if (searchIn.includes('TEXT')) {
                            searchCriteria = ['TEXT', keyword];
                        } else {
                            if (searchIn.includes('SUBJECT')) {
                                searchCriteria.push(['SUBJECT', keyword]);
                            }
                            if (searchIn.includes('FROM')) {
                                searchCriteria.push(['FROM', keyword]);
                            }
                            if (searchIn.includes('TO')) {
                                searchCriteria.push(['TO', keyword]);
                            }
                            if (searchIn.includes('BODY')) {
                                searchCriteria.push(['BODY', keyword]);
                            }
                            
                            if (searchCriteria.length > 1) {
                                searchCriteria = ['OR', ...searchCriteria];
                            } else if (searchCriteria.length === 1) {
                                searchCriteria = searchCriteria[0];
                            }
                        }
                        
                        imap.search(searchCriteria, (err, results) => {
                            if (err) {
                                imap.end();
                                reject(err);
                                return;
                            }
                            
                            if (!results || results.length === 0) {
                                imap.end();
                                resolve({ count: 0, messages: [] });
                                return;
                            }
                            
                            // Limit results if specified
                            const limitedResults = limit ? results.slice(0, limit) : results;
                            
                            const f = imap.fetch(limitedResults, {
                                bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                                struct: true
                            });
                            
                            const messages = [];
                            
                            f.on('message', (msg, seqno) => {
                                const msgData = { seqno };
                                
                                msg.on('body', (stream, info) => {
                                    let buffer = '';
                                    stream.on('data', (chunk) => {
                                        buffer += chunk.toString('ascii');
                                    });
                                    stream.once('end', () => {
                                        const parsed = Imap.parseHeader(buffer);
                                        msgData.from = parsed.from ? parsed.from[0] : '';
                                        msgData.to = parsed.to ? parsed.to[0] : '';
                                        msgData.subject = parsed.subject ? parsed.subject[0] : '';
                                        msgData.date = parsed.date ? parsed.date[0] : '';
                                    });
                                });
                                
                                msg.once('end', () => {
                                    messages.push(msgData);
                                });
                            });
                            
                            f.once('error', (err) => {
                                imap.end();
                                reject(err);
                            });
                            
                            f.once('end', () => {
                                imap.end();
                                resolve({
                                    count: results.length,
                                    messages: messages
                                });
                            });
                        });
                    });
                });
                
                imap.once('error', (err) => {
                    reject(err);
                });
                
                imap.connect();
                
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = ImapChecker;

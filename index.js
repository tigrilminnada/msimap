const ImapChecker = require('./lib/ImapChecker');
const { IMAP_SERVERS } = require('./lib/config');

/**
 * Factory function untuk membuat instance ImapChecker baru
 * @param {Object} options - Opsi konfigurasi
 * @returns {ImapChecker} Instance ImapChecker
 */
function createImapChecker(options = {}) {
    return new ImapChecker(options);
}

/**
 * Fungsi helper untuk quick check login
 * @param {string} email - Alamat email
 * @param {string} password - Password
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>} Hasil check login
 */
async function quickLoginCheck(email, password, options = {}) {
    const checker = new ImapChecker(options);
    return await checker.login(email, password);
}

/**
 * Fungsi helper untuk quick search
 * @param {string} email - Alamat email
 * @param {string} password - Password
 * @param {string} keyword - Keyword pencarian
 * @param {Object} options - Opsi pencarian
 * @returns {Promise<Object>} Hasil pencarian
 */
async function quickSearch(email, password, keyword, options = {}) {
    const checker = new ImapChecker(options);
    return await checker.searchInboxByKeyword(email, password, keyword, options);
}

/**
 * Fungsi helper untuk mendapatkan total count inbox
 * @param {string} email - Alamat email
 * @param {string} password - Password
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<number>} Total count inbox
 */
async function quickInboxCount(email, password, options = {}) {
    const checker = new ImapChecker(options);
    return await checker.getTotalInboxCount(email, password);
}

/**
 * Fungsi helper untuk mendapatkan statistik lengkap
 * @param {string} email - Alamat email
 * @param {string} password - Password
 * @param {Array} keywords - Keywords untuk dicari
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>} Statistik lengkap
 */
async function quickStats(email, password, keywords = [], options = {}) {
    const checker = new ImapChecker(options);
    return await checker.getInboxStats(email, password, keywords);
}

/**
 * Fungsi untuk mengecek apakah domain didukung
 * @param {string} email - Alamat email
 * @returns {boolean} True jika didukung
 */
function isDomainSupported(email) {
    try {
        const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
        return IMAP_SERVERS.hasOwnProperty(domain);
    } catch (error) {
        return false;
    }
}

/**
 * Fungsi untuk mendapatkan konfigurasi server berdasarkan email
 * @param {string} email - Alamat email
 * @returns {Object|null} Konfigurasi server atau null jika tidak ditemukan
 */
function getServerConfig(email) {
    try {
        const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
        return IMAP_SERVERS[domain] || null;
    } catch (error) {
        return null;
    }
}

/**
 * Fungsi untuk mendapatkan daftar semua domain yang didukung
 * @returns {Array} Array domain yang didukung
 */
function getSupportedDomains() {
    return Object.keys(IMAP_SERVERS);
}

module.exports = {
    // Main class
    ImapChecker,
    
    // Factory function
    createImapChecker,
    
    // Quick helper functions
    quickLoginCheck,
    quickSearch,
    quickInboxCount,
    quickStats,
    
    // Utility functions
    isDomainSupported,
    getServerConfig,
    getSupportedDomains,
    
    // Constants
    IMAP_SERVERS
};

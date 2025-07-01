// DOM Elements
const minimizeBtn = document.getElementById('minimize-btn');
const closeBtn = document.getElementById('close-btn');
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const addAccountBtn = document.getElementById('add-account-btn');
const addAccountModal = document.getElementById('add-account-modal');
const modalClose = document.getElementById('modal-close');
const cancelBtn = document.getElementById('cancel-btn');
const addAccountForm = document.getElementById('add-account-form');
const accountsList = document.getElementById('accounts-list');
const accountsCount = document.getElementById('accounts-count');
const removeAllBtn = document.getElementById('remove-all-btn');
const removeCrackedBtn = document.getElementById('remove-cracked-btn');
const removePremiumBtn = document.getElementById('remove-premium-btn');
const toastContainer = document.getElementById('toast-container');

// Global state
let accounts = {};

// Initialize the app
async function init() {
    setupEventListeners();
    await loadAccounts();
    updateAccountsDisplay();
}

// Event Listeners
function setupEventListeners() {
    // Window controls
    minimizeBtn.addEventListener('click', () => {
        window.electronAPI.minimizeWindow();
    });

    closeBtn.addEventListener('click', () => {
        window.electronAPI.closeWindow();
    });

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            switchTab(e.target.closest('.nav-item').dataset.tab);
        });
    });

    // Modal controls
    addAccountBtn.addEventListener('click', openAddAccountModal);
    modalClose.addEventListener('click', closeAddAccountModal);
    cancelBtn.addEventListener('click', closeAddAccountModal);
    
    // Close modal on overlay click
    addAccountModal.addEventListener('click', (e) => {
        if (e.target === addAccountModal) {
            closeAddAccountModal();
        }
    });

    // Form submission
    addAccountForm.addEventListener('submit', handleAddAccount);

    // Account management
    removeAllBtn.addEventListener('click', handleRemoveAllAccounts);
    removeCrackedBtn.addEventListener('click', handleRemoveCrackedAccounts);
    removePremiumBtn.addEventListener('click', handleRemovePremiumAccounts);

    // Real-time validation
    const usernameInput = document.getElementById('username');
    const uuidInput = document.getElementById('uuid');

    usernameInput.addEventListener('input', validateUsernameInput);
    uuidInput.addEventListener('input', validateUUIDInput);

    // External links
    const githubLink = document.getElementById('github-link');
    if (githubLink) {
        githubLink.addEventListener('click', handleExternalLink);
    }
}

// Tab switching
function switchTab(tabName) {
    // Update navigation
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tabName);
    });

    // Update content
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
}

// Modal controls
function openAddAccountModal() {
    addAccountModal.classList.add('active');
    document.getElementById('username').focus();
}

function closeAddAccountModal() {
    addAccountModal.classList.remove('active');
    addAccountForm.reset();
    clearValidationErrors();
}

// Load accounts from main process
async function loadAccounts() {
    try {
        const result = await window.electronAPI.loadAccounts();
        if (result.success) {
            accounts = result.accounts;
        } else {
            showToast('error', 'Error', result.error || 'Failed to load accounts');
            accounts = {};
        }
    } catch (error) {
        showToast('error', 'Error', 'Failed to load accounts: ' + error.message);
        accounts = {};
    }
}

// Update accounts display
function updateAccountsDisplay() {
    const accountsArray = Object.entries(accounts);
    accountsCount.textContent = `${accountsArray.length} account${accountsArray.length !== 1 ? 's' : ''}`;

    if (accountsArray.length === 0) {
        accountsList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V18C3 19.1 3.9 20 5 20H11V18H5V8H12V6H5V3H13V9H21ZM17 11C15.34 11 14 12.34 14 14C14 15.66 15.34 17 17 17C18.66 17 20 15.66 20 14C20 12.34 18.66 11 17 11ZM17 21V19.5C19.5 19.5 21.5 17.5 21.5 15H23C23 18.59 20.09 21.5 16.5 21.5V23L14 20.5L16.5 18V19.5C15.67 19.5 15 18.83 15 18H16.5C16.5 17.17 17.17 16.5 18 16.5V15C16.34 15 15 16.34 15 18C15 19.66 16.34 21 18 21H17Z"/>
                </svg>
                <h3>No Accounts Found</h3>
                <p>Click "Add Account" to create your first account</p>
            </div>
        `;
        return;
    }

    accountsList.innerHTML = accountsArray.map(([id, account]) => {
        const isPremium = isValidUUID(account.accessToken);
        return `
            <div class="account-item">
                <div class="account-info">
                    <div class="account-avatar">
                        ${account.username.charAt(0).toUpperCase()}
                    </div>
                    <div class="account-details">
                        <h3>${escapeHtml(account.username)}</h3>
                        <span class="account-type ${isPremium ? 'premium' : 'cracked'}">
                            ${isPremium ? 'Premium' : 'Cracked'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Handle add account form submission
async function handleAddAccount(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const uuid = document.getElementById('uuid').value.trim();

    // Validate inputs
    const isUsernameValid = await window.electronAPI.validateUsername(username);
    const isUUIDValid = await window.electronAPI.validateUUID(uuid);

    if (!isUsernameValid) {
        showValidationError('username', 'Invalid username format');
        return;
    }

    if (!isUUIDValid) {
        showValidationError('uuid', 'Invalid UUID format');
        return;
    }

    // Check if account already exists
    if (accounts[uuid]) {
        showValidationError('uuid', 'Account with this UUID already exists');
        return;
    }

    try {
        const result = await window.electronAPI.createAccount({ username, uuid });
        if (result.success) {
            await loadAccounts();
            updateAccountsDisplay();
            closeAddAccountModal();
            showToast('success', 'Success', `Account "${username}" created successfully`);
        } else {
            showToast('error', 'Error', result.error || 'Failed to create account');
        }
    } catch (error) {
        showToast('error', 'Error', 'Failed to create account: ' + error.message);
    }
}

// Handle remove all accounts
async function handleRemoveAllAccounts() {
    if (Object.keys(accounts).length === 0) {
        showToast('warning', 'Warning', 'No accounts to remove');
        return;
    }

    if (!confirm('Are you sure you want to remove all accounts? This action cannot be undone.')) {
        return;
    }

    try {
        const result = await window.electronAPI.removeAllAccounts();
        if (result.success) {
            await loadAccounts();
            updateAccountsDisplay();
            showToast('success', 'Success', 'All accounts removed successfully');
        } else {
            showToast('error', 'Error', result.error || 'Failed to remove accounts');
        }
    } catch (error) {
        showToast('error', 'Error', 'Failed to remove accounts: ' + error.message);
    }
}

// Handle remove cracked accounts
async function handleRemoveCrackedAccounts() {
    const crackedCount = Object.values(accounts).filter(account => !isValidUUID(account.accessToken)).length;
    
    if (crackedCount === 0) {
        showToast('warning', 'Warning', 'No cracked accounts to remove');
        return;
    }

    if (!confirm(`Are you sure you want to remove ${crackedCount} cracked account${crackedCount !== 1 ? 's' : ''}? This action cannot be undone.`)) {
        return;
    }

    try {
        const result = await window.electronAPI.removeCrackedAccounts();
        if (result.success) {
            await loadAccounts();
            updateAccountsDisplay();
            showToast('success', 'Success', 'Cracked accounts removed successfully');
        } else {
            showToast('error', 'Error', result.error || 'Failed to remove cracked accounts');
        }
    } catch (error) {
        showToast('error', 'Error', 'Failed to remove cracked accounts: ' + error.message);
    }
}

// Handle remove premium accounts
async function handleRemovePremiumAccounts() {
    const premiumCount = Object.values(accounts).filter(account => isValidUUID(account.accessToken)).length;
    
    if (premiumCount === 0) {
        showToast('warning', 'Warning', 'No premium accounts to remove');
        return;
    }

    if (!confirm(`Are you sure you want to remove ${premiumCount} premium account${premiumCount !== 1 ? 's' : ''}? This action cannot be undone.`)) {
        return;
    }

    try {
        const result = await window.electronAPI.removePremiumAccounts();
        if (result.success) {
            await loadAccounts();
            updateAccountsDisplay();
            showToast('success', 'Success', 'Premium accounts removed successfully');
        } else {
            showToast('error', 'Error', result.error || 'Failed to remove premium accounts');
        }
    } catch (error) {
        showToast('error', 'Error', 'Failed to remove premium accounts: ' + error.message);
    }
}

// Validation functions
async function validateUsernameInput(e) {
    const input = e.target;
    const isValid = await window.electronAPI.validateUsername(input.value);
    
    if (input.value && !isValid) {
        showValidationError('username', 'Username must be 3-16 characters and contain only letters, numbers, and underscores');
    } else {
        clearValidationError('username');
    }
}

async function validateUUIDInput(e) {
    const input = e.target;
    const isValid = await window.electronAPI.validateUUID(input.value);
    
    if (input.value && !isValid) {
        showValidationError('uuid', 'Please enter a valid UUID format (e.g., 12345678-1234-1234-1234-123456789abc)');
    } else {
        clearValidationError('uuid');
    }
}

function showValidationError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const existingError = field.parentNode.querySelector('.validation-error');
    
    if (existingError) {
        existingError.textContent = message;
    } else {
        const errorElement = document.createElement('span');
        errorElement.className = 'validation-error';
        errorElement.style.cssText = 'color: var(--danger-color); font-size: 12px; margin-top: 4px; display: block;';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
    
    field.style.borderColor = 'var(--danger-color)';
}

function clearValidationError(fieldName) {
    const field = document.getElementById(fieldName);
    const existingError = field.parentNode.querySelector('.validation-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    field.style.borderColor = '';
}

function clearValidationErrors() {
    document.querySelectorAll('.validation-error').forEach(error => error.remove());
    document.querySelectorAll('input').forEach(input => input.style.borderColor = '');
}

// Toast notifications
function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            <div class="toast-message">${escapeHtml(message)}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastSlideIn 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success':
            return `<svg viewBox="0 0 24 24" fill="currentColor" style="color: var(--success-color)">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>`;
        case 'error':
            return `<svg viewBox="0 0 24 24" fill="currentColor" style="color: var(--danger-color)">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>`;
        case 'warning':
            return `<svg viewBox="0 0 24 24" fill="currentColor" style="color: var(--warning-color)">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>`;
        default:
            return '';
    }
}

// Utility functions
function isValidUUID(uuid) {
    const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return pattern.test(uuid);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Handle external link clicks
async function handleExternalLink(e) {
    e.preventDefault();
    const url = e.target.href;
    if (url) {
        try {
            const result = await window.electronAPI.openExternalUrl(url);
            if (!result.success) {
                showToast('error', 'Error', 'Failed to open link in browser');
            }
        } catch (error) {
            console.error('Error opening external link:', error);
            showToast('error', 'Error', 'Failed to open link in browser');
        }
    }
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showToast('error', 'Application Error', 'An unexpected error occurred');
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

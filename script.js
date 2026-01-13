// Expense Manager JavaScript

// Database key for localStorage
const DB_KEY = 'expense_manager_db';

// Initialize database
let expenseDB = {
    records: [],
    lastId: 0
};

// Load database from localStorage
function loadDatabase() {
    try {
        const data = localStorage.getItem(DB_KEY);
        if (data) {
            expenseDB = JSON.parse(data);
            console.log('Database loaded:', expenseDB);
        } else {
            console.log('Creating new database');
            saveDatabase();
        }
    } catch (error) {
        console.error('Error loading database:', error);
        expenseDB = { records: [], lastId: 0 };
        saveDatabase();
    }
}

// Save database to localStorage
function saveDatabase() {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(expenseDB));
        console.log('Database saved');
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadDatabase();
    updateStats();
    renderRecords();
    populateCategories();
    setDefaultDates();
    createStarfield();
});

// Create animated starfield
function createStarfield() {
    const layers = [
        { class: 'starfield-layer-1', count: 200, sizes: ['small', 'medium'] },
        { class: 'starfield-layer-2', count: 150, sizes: ['small', 'medium', 'large'] },
        { class: 'starfield-layer-3', count: 100, sizes: ['medium', 'large'] }
    ];

    layers.forEach(layer => {
        const layerEl = document.querySelector(`.${layer.class}`);
        if (!layerEl) return;

        for (let i = 0; i < layer.count; i++) {
            const star = document.createElement('div');
            star.className = `star ${layer.sizes[Math.floor(Math.random() * layer.sizes.length)]}`;
            
            // Random position
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            // Random animation delay
            star.style.animationDelay = Math.random() * 5 + 's';
            
            // Random twinkle speed
            const twinkleSpeed = 2 + Math.random() * 3;
            star.style.animationDuration = twinkleSpeed + 's';
            
            layerEl.appendChild(star);
        }
    });
}

// Set default dates to today
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;
    document.getElementById('creditDate').value = today;
}

// Modal functions
function showAddExpenseModal() {
    // Set today's date before showing modal
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('expenseDate');
    if (dateInput) {
        dateInput.value = today;
    }
    document.getElementById('expenseModal').classList.add('show');
    document.getElementById('expenseAmount').focus();
}

function showAddCreditModal() {
    // Set today's date before showing modal
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('creditDate');
    if (dateInput) {
        dateInput.value = today;
    }
    document.getElementById('creditModal').classList.add('show');
    document.getElementById('creditCardName').focus();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    // Reset forms
    const form = document.getElementById(modalId.replace('Modal', 'Form'));
    if (form) {
        form.reset();
        setDefaultDates();
    }
}

// Close modal on outside click
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
};

// Handle form submissions
function handleAddExpense(event) {
    event.preventDefault();
    
    const amountInput = document.getElementById('expenseAmount');
    const categoryInput = document.getElementById('expenseCategory');
    const descriptionInput = document.getElementById('expenseDescription');
    const dateInput = document.getElementById('expenseDate');
    
    if (!amountInput || !categoryInput || !dateInput) {
        console.error('Expense form elements not found');
        showNotification('Error: Form elements not found. Please refresh the page.');
        return;
    }
    
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const description = descriptionInput.value || 'Expense';
    
    // Use today's date if date is not set
    let date = dateInput.value;
    if (!date) {
        date = new Date().toISOString().split('T')[0];
        dateInput.value = date;
    }
    
    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount!');
        amountInput.focus();
        return;
    }
    
    addRecord('expense', amount, category, description, date);
    closeModal('expenseModal');
}

function handleAddCreditExpense(event) {
    event.preventDefault();
    
    const cardName = document.getElementById('creditCardName').value;
    const amount = parseFloat(document.getElementById('creditAmount').value);
    const description = document.getElementById('creditDescription').value || 'Credit Card Expense';
    const date = document.getElementById('creditDate').value;
    
    addRecord('credit', amount, cardName, description, date);
    closeModal('creditModal');
}

// Add record to database
function addRecord(type, amount, category, description, date) {
    const record = {
        id: ++expenseDB.lastId,
        type: type,
        amount: amount,
        category: category,
        description: description,
        date: date,
        timestamp: new Date().toISOString()
    };
    
    expenseDB.records.push(record);
    saveDatabase();
    updateStats();
    renderRecords();
    
    // Show success message
    showNotification(`${type === 'expense' ? 'Expense' : 'Credit Card Expense'} added successfully!`);
}

// Delete record
function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        expenseDB.records = expenseDB.records.filter(record => record.id !== id);
        saveDatabase();
        updateStats();
        renderRecords();
        showNotification('Record deleted successfully!');
    }
}

// Duplicate expense with today's date
function duplicateExpense(id) {
    const originalRecord = expenseDB.records.find(record => record.id === id);
    
    if (!originalRecord) {
        showNotification('Record not found!');
        return;
    }
    
    if (originalRecord.type !== 'expense') {
        showNotification('Only expenses can be duplicated!');
        return;
    }
    
    // Create duplicate with today's date
    const today = new Date().toISOString().split('T')[0];
    const duplicateRecord = {
        id: ++expenseDB.lastId,
        type: originalRecord.type,
        amount: originalRecord.amount,
        category: originalRecord.category,
        description: originalRecord.description,
        date: today,
        timestamp: new Date().toISOString()
    };
    
    expenseDB.records.push(duplicateRecord);
    saveDatabase();
    updateStats();
    renderRecords();
    showNotification('Expense duplicated with today\'s date!');
}

// Update statistics
function updateStats() {
    let totalExpense = 0;
    let totalCreditDebt = 0;
    
    expenseDB.records.forEach(record => {
        if (record.type === 'expense') {
            totalExpense += record.amount;
        } else if (record.type === 'credit') {
            totalCreditDebt += record.amount;
        }
    });
    
    const balance = -(totalExpense + totalCreditDebt);
    
    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    document.getElementById('totalBalance').textContent = formatCurrency(balance);
    document.getElementById('totalCreditDebt').textContent = formatCurrency(totalCreditDebt);
    
    // Update balance color (always negative since no income)
    const balanceEl = document.getElementById('totalBalance');
    balanceEl.style.color = 'var(--accent-red)';
}

// Format currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Render records table
function renderRecords() {
    const tbody = document.getElementById('recordsTableBody');
    const filteredRecords = getFilteredRecords();
    
    if (filteredRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No records found. Add your first expense!</td></tr>';
        return;
    }
    
    // Sort by date (newest first)
    filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tbody.innerHTML = filteredRecords.map(record => {
        const date = new Date(record.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const typeClass = `type-${record.type}`;
        const typeLabel = record.type === 'expense' ? 'Expense' : 'Credit';
        const amountClass = 'negative';
        const amountSign = '-';
        
        // Show duplicate button only for expenses
        const duplicateButton = record.type === 'expense' 
            ? `<button class="btn-duplicate" onclick="duplicateExpense(${record.id})" title="Duplicate with today's date">➕</button>`
            : '';
        
        return `
            <tr>
                <td>${date}</td>
                <td><span class="type-badge ${typeClass}">${typeLabel}</span></td>
                <td>${formatCategory(record.category)}</td>
                <td>${record.description}</td>
                <td class="amount ${amountClass}">${amountSign}${formatCurrency(record.amount)}</td>
                <td>
                    <div class="action-buttons-cell">
                        ${duplicateButton}
                        <button class="btn-delete" onclick="deleteRecord(${record.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Format category name
function formatCategory(category) {
    return category.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Get filtered records
function getFilteredRecords() {
    let records = [...expenseDB.records];
    
    // Exclude income records
    records = records.filter(record => record.type !== 'income');
    
    // Filter by type
    const typeFilter = document.getElementById('filterType').value;
    if (typeFilter !== 'all') {
        records = records.filter(record => record.type === typeFilter);
    }
    
    // Filter by category
    const categoryFilter = document.getElementById('filterCategory').value;
    if (categoryFilter !== 'all') {
        records = records.filter(record => record.category === categoryFilter);
    }
    
    // Filter by date
    const dateFilter = document.getElementById('filterDate').value;
    if (dateFilter) {
        records = records.filter(record => {
            const recordDate = new Date(record.date);
            const filterDate = new Date(dateFilter);
            return recordDate.getFullYear() === filterDate.getFullYear() &&
                   recordDate.getMonth() === filterDate.getMonth();
        });
    }
    
    return records;
}

// Apply filters
function applyFilters() {
    renderRecords();
    updateCategoryFilter();
}

// Clear filters
function clearFilters() {
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterCategory').value = 'all';
    document.getElementById('filterDate').value = '';
    renderRecords();
}

// Populate categories
function populateCategories() {
    const categorySelect = document.getElementById('filterCategory');
    const categories = new Set();
    
    expenseDB.records.forEach(record => {
        categories.add(record.category);
    });
    
    // Clear existing options except "All Categories"
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    
    // Add categories
    Array.from(categories).sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = formatCategory(category);
        categorySelect.appendChild(option);
    });
}

// Update category filter options
function updateCategoryFilter() {
    populateCategories();
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 15px 25px;
        border-radius: 10px;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Expense Tracker Functionality
const balanceEl = document.getElementById('balance');
const transactionListEl = document.getElementById('transaction-list');
const transactionForm = document.getElementById('transaction-form');
const errorMessageEl = document.getElementById('error-message');

let transactions = [];

// Load transactions from localStorage
function loadTransactions() {
    const data = localStorage.getItem('transactions');
    transactions = data ? JSON.parse(data) : [];
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Calculate and display balance
function updateBalance() {
    let income = 0, expense = 0;
    transactions.forEach(t => {
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
    });
    balanceEl.textContent = `$${(income - expense).toFixed(2)}`;
}

// Render transaction history
function renderTransactions() {
    transactionListEl.innerHTML = '';
    transactions.forEach((t, idx) => {
        const li = document.createElement('li');
        li.className = `transaction ${t.type}`;
        li.innerHTML = `
            <span class="name">${t.name}</span>
            <span class="amount">${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}</span>
            <span class="type">${t.type.charAt(0).toUpperCase() + t.type.slice(1)}</span>
            <button class="delete-btn" data-idx="${idx}">Delete</button>
        `;
        transactionListEl.appendChild(li);
    });
}

// Add transaction
transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    errorMessageEl.textContent = '';
    const name = document.getElementById('name').value.trim();
    let amount = parseFloat(document.getElementById('amount').value);
    const type = document.querySelector('input[name="type"]:checked').value;

    // Validation
    if (!name) {
        errorMessageEl.textContent = 'Please enter a transaction name.';
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        errorMessageEl.textContent = 'Please enter a valid amount.';
        return;
    }
    if (type === 'expense') amount = Math.abs(amount);

    transactions.push({ name, amount, type });
    saveTransactions();
    renderTransactions();
    updateBalance();
    transactionForm.reset();
});

// Delete transaction
transactionListEl.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const idx = e.target.getAttribute('data-idx');
        transactions.splice(idx, 1);
        saveTransactions();
        renderTransactions();
        updateBalance();
    }
});

// Initial load
loadTransactions();
renderTransactions();
updateBalance();

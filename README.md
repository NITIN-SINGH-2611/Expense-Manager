# Expense Manager 💰

A comprehensive expense tracking application to manage your income, expenses, and credit card expenses.

## ✨ Features

- **Income Tracking** - Record all your income sources
- **Expense Tracking** - Track all your expenses by category
- **Credit Card Expenses** - Track credit card expenses and spending
- **Statistics Dashboard** - View total income, expenses, balance, and credit debt
- **Filtering** - Filter records by type, category, and date
- **Data Persistence** - All data stored locally in browser (localStorage)
- **No Server Required** - Works completely offline

## 🚀 How to Use

### Option 1: With Server (Recommended - Cross-Device Sync)
1. Install Python dependencies: `pip install -r requirements.txt`
2. Start the server: `python server.py` (or double-click `start_server.bat` on Windows)
3. Open `http://localhost:5002` in your browser
4. Your expenses will sync across all devices!

### Option 2: Local File (Offline Mode)
1. Just open `index.html` in your browser
2. Data will be stored locally in your browser
3. Note: Data won't sync across devices without server

### Option 3: GitHub Pages
1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Note: For cross-device sync, you'll need to deploy the server separately

## 📊 Features Breakdown

### Income Management
- Add income from various sources (Salary, Freelance, Investment, etc.)
- Track income by category
- View total income in dashboard

### Expense Management
- Track expenses by category:
  - Food & Dining
  - Transportation
  - Shopping
  - Bills & Utilities
  - Entertainment
  - Healthcare
  - Education
  - Travel
  - Other
- View total expenses in dashboard

### Credit Card Expenses
- Record credit card expenses
- Track credit card spending
- Monitor expense history

### Statistics
- **Total Income** - Sum of all income records
- **Total Expenses** - Sum of all expense records
- **Balance** - Income minus expenses and credit debt
- **Credit Card Debt** - Total credit card expenses

### Filtering
- Filter by type (Income/Expense/Credit)
- Filter by category
- Filter by month/year
- Clear filters to view all records

## 💾 Data Storage

### With Server (Recommended)
- **Storage**: Server-side JSON file (`expense_data.json`)
- **Sync**: Automatically syncs across all devices
- **Backup**: Also saved to browser localStorage as backup
- **Access**: Access from any device on the same network

### Without Server (Offline Mode)
- **Storage**: Browser localStorage
- **Key**: `expense_manager_db`
- **Format**: JSON
- **Persistent**: Data stays even after browser closes
- **Note**: Data is device-specific and won't sync

## 📁 Project Structure

```
Expense Manager/
├── index.html      # Main application page
├── styles.css      # Styling (dark theme)
├── script.js       # Application logic
└── README.md       # Documentation
```

## 🎨 Design

- **Dark Theme** - Easy on the eyes
- **Modern UI** - Clean and intuitive interface
- **Responsive** - Works on desktop and mobile
- **Animations** - Smooth transitions and effects

## 🔧 Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **Database**: Browser localStorage
- **No Backend**: Fully client-side
- **No Dependencies**: Pure vanilla JavaScript

## 📝 Usage Tips

1. **Add Income First** - Start by adding your income sources
2. **Track Everything** - Record all expenses, no matter how small
3. **Use Categories** - Categorize expenses for better insights
4. **Regular Updates** - Update records regularly for accurate tracking
5. **Review Monthly** - Use date filters to review monthly spending

## 🎯 Future Enhancements

Potential features to add:
- Export data to CSV/Excel
- Charts and graphs for visualization
- Budget setting and tracking
- Recurring expenses/income
- Multiple currency support
- Data backup/restore

---

**Start tracking your expenses today! 🚀**

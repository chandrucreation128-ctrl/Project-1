// Monthly Sales Report System

// Generate report
function generateReport() {
    const monthInput = document.getElementById('report-month').value;
    if (!monthInput) {
        document.getElementById('report-content').innerHTML = '<p>Please select a month</p>';
        return;
    }

    const user = getCurrentUser();
    if (!user) return;

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const userTransactions = transactions.filter(t => t.userId === user.id);

    // Filter by selected month
    const [year, month] = monthInput.split('-');
    const filteredTransactions = userTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() == year && 
               (transactionDate.getMonth() + 1) == month;
    });

    displayReport(filteredTransactions, monthInput);
}

// Display report
function displayReport(transactions, monthInput) {
    const reportContent = document.getElementById('report-content');

    if (transactions.length === 0) {
        reportContent.innerHTML = '<div class="empty-cart">No transactions found for this month</div>';
        return;
    }

    // Calculate statistics
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = transactions.length;
    const totalItems = transactions.reduce((sum, t) => 
        sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    // Get top selling products
    const productSales = {};
    transactions.forEach(transaction => {
        transaction.items.forEach(item => {
            if (!productSales[item.name]) {
                productSales[item.name] = { quantity: 0, revenue: 0 };
            }
            productSales[item.name].quantity += item.quantity;
            productSales[item.name].revenue += item.total;
        });
    });

    const topProducts = Object.entries(productSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

    const monthName = new Date(monthInput + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    reportContent.innerHTML = `
        <h2>Sales Report for ${monthName}</h2>
        
        <div class="report-stats">
            <div class="stat-card">
                <div class="stat-value">₹${totalSales.toFixed(2)}</div>
                <div class="stat-label">Total Sales</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalTransactions}</div>
                <div class="stat-label">Total Transactions</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalItems}</div>
                <div class="stat-label">Items Sold</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">₹${(totalSales / totalTransactions).toFixed(2)}</div>
                <div class="stat-label">Average Order Value</div>
            </div>
        </div>

        <h3 style="margin-top: 30px; margin-bottom: 15px;">Top Selling Products</h3>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                ${topProducts.map(product => `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>₹${product.revenue.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <h3 style="margin-top: 30px; margin-bottom: 15px;">Transaction Details</h3>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Invoice Number</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(transaction => `
                    <tr>
                        <td>${transaction.invoiceNumber}</td>
                        <td>${formatDate(transaction.date)}</td>
                        <td>${transaction.items.length}</td>
                        <td>₹${transaction.total.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Store current report data for export
    currentReportData = {
        transactions,
        monthInput,
        totalSales,
        totalTransactions,
        totalItems,
        topProducts
    };
}

// Export report as PDF
function exportReportPDF() {
    if (!currentReportData) {
        showToast('Please generate a report first', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const monthName = new Date(currentReportData.monthInput + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    // Header
    doc.setFontSize(20);
    doc.text('Monthly Sales Report', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text(monthName, 105, 30, { align: 'center' });

    // Statistics
    doc.setFontSize(12);
    let yPos = 45;
    doc.text(`Total Sales: ₹${currentReportData.totalSales.toFixed(2)}`, 20, yPos);
    doc.text(`Total Transactions: ${currentReportData.totalTransactions}`, 20, yPos + 7);
    doc.text(`Items Sold: ${currentReportData.totalItems}`, 20, yPos + 14);
    doc.text(`Average Order Value: ₹${(currentReportData.totalSales / currentReportData.totalTransactions).toFixed(2)}`, 20, yPos + 21);

    // Top Products Table
    yPos += 35;
    doc.setFontSize(14);
    doc.text('Top Selling Products', 20, yPos);
    
    const topProductsData = currentReportData.topProducts.map(p => [
        p.name,
        p.quantity.toString(),
        `₹${p.revenue.toFixed(2)}`
    ]);

    doc.autoTable({
        startY: yPos + 5,
        head: [['Product Name', 'Quantity Sold', 'Revenue']],
        body: topProductsData,
        theme: 'striped',
        headStyles: { fillColor: [102, 126, 234] }
    });

    // Transactions Table
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Transaction Details', 20, finalY);
    
    const transactionsData = currentReportData.transactions.map(t => [
        t.invoiceNumber,
        formatDateShort(t.date),
        t.items.length.toString(),
        `₹${t.total.toFixed(2)}`
    ]);

    doc.autoTable({
        startY: finalY + 5,
        head: [['Invoice Number', 'Date', 'Items', 'Total']],
        body: transactionsData,
        theme: 'striped',
        headStyles: { fillColor: [102, 126, 234] }
    });

    doc.save(`Sales_Report_${currentReportData.monthInput}.pdf`);
    showToast('Report exported as PDF');
}

// Export report as text
function exportReportText() {
    if (!currentReportData) {
        showToast('Please generate a report first', 'error');
        return;
    }

    const monthName = new Date(currentReportData.monthInput + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    let text = `MONTHLY SALES REPORT\n`;
    text += `========================\n\n`;
    text += `Period: ${monthName}\n\n`;
    text += `STATISTICS\n`;
    text += `----------\n`;
    text += `Total Sales: ₹${currentReportData.totalSales.toFixed(2)}\n`;
    text += `Total Transactions: ${currentReportData.totalTransactions}\n`;
    text += `Items Sold: ${currentReportData.totalItems}\n`;
    text += `Average Order Value: ₹${(currentReportData.totalSales / currentReportData.totalTransactions).toFixed(2)}\n\n`;

    text += `TOP SELLING PRODUCTS\n`;
    text += `--------------------\n`;
    currentReportData.topProducts.forEach((product, index) => {
        text += `${index + 1}. ${product.name}\n`;
        text += `   Quantity: ${product.quantity}\n`;
        text += `   Revenue: ₹${product.revenue.toFixed(2)}\n\n`;
    });

    text += `TRANSACTION DETAILS\n`;
    text += `--------------------\n`;
    currentReportData.transactions.forEach(transaction => {
        text += `Invoice: ${transaction.invoiceNumber}\n`;
        text += `Date: ${formatDate(transaction.date)}\n`;
        text += `Items: ${transaction.items.length}\n`;
        text += `Total: ₹${transaction.total.toFixed(2)}\n\n`;
    });

    // Create download link
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sales_Report_${currentReportData.monthInput}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Report exported as text file');
}

// Format date short
function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Current report data for export
let currentReportData = null;

// Set default month to current month
document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthInput = document.getElementById('report-month');
    if (monthInput) {
        monthInput.value = month;
        generateReport();
    }
});


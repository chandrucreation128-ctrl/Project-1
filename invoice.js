// Invoice Generation System

// Load invoices
function loadInvoices() {
    const user = getCurrentUser();
    if (!user) return;

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const userTransactions = transactions.filter(t => t.userId === user.id);
    
    // Sort by date (newest first)
    userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    displayInvoices(userTransactions);
}

// Display invoices list
function displayInvoices(transactions) {
    const invoicesList = document.getElementById('invoices-list');

    if (transactions.length === 0) {
        invoicesList.innerHTML = '<div class="empty-cart">No invoices found</div>';
        return;
    }

    invoicesList.innerHTML = transactions.map(transaction => `
        <div class="invoice-item" onclick="viewInvoice('${transaction.id}')">
            <div class="invoice-header">
                <div>
                    <div class="invoice-number">${transaction.invoiceNumber}</div>
                    <div class="invoice-date">${formatDate(transaction.date)}</div>
                </div>
                <div class="invoice-total">₹${transaction.total.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

// View invoice
function viewInvoice(transactionId) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transaction = transactions.find(t => t.id === transactionId);

    if (!transaction) {
        showToast('Invoice not found', 'error');
        return;
    }

    displayInvoice(transaction);
    document.getElementById('invoice-modal').classList.add('show');
    currentInvoice = transaction;
}

// Display invoice in modal
function displayInvoice(transaction) {
    const invoiceContent = document.getElementById('invoice-content');
    
    invoiceContent.innerHTML = `
        <div class="invoice-view">
            <div class="invoice-header-view">
                <div>
                    <h2>INVOICE</h2>
                    <p><strong>Invoice Number:</strong> ${transaction.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${formatDate(transaction.date)}</p>
                </div>
                <div>
                    <h3>Studio Billing System</h3>
                    <p>Billing Application</p>
                </div>
            </div>
            
            <div class="invoice-details">
                <table class="invoice-items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transaction.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>₹${parseFloat(item.price).toFixed(2)}</td>
                                <td>₹${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="invoice-totals">
                <div class="invoice-totals-row total">
                    <span>Total:</span>
                    <span>₹${transaction.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

// Close invoice modal
function closeInvoiceModal() {
    document.getElementById('invoice-modal').classList.remove('show');
    currentInvoice = null;
}

// Print invoice
function printInvoice() {
    if (!currentInvoice) return;
    
    const printWindow = window.open('', '_blank');
    const invoiceHtml = generateInvoiceHTML(currentInvoice);
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice ${currentInvoice.invoiceNumber}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background: #f0f0f0; }
                    .totals { text-align: right; margin-top: 20px; }
                    .total-row { font-size: 18px; font-weight: bold; }
                </style>
            </head>
            <body>
                ${invoiceHtml}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Generate invoice HTML
function generateInvoiceHTML(transaction) {
    return `
        <div class="invoice-header">
            <div>
                <h2>INVOICE</h2>
                <p><strong>Invoice Number:</strong> ${transaction.invoiceNumber}</p>
                <p><strong>Date:</strong> ${formatDate(transaction.date)}</p>
            </div>
            <div>
                <h3>Studio Billing System</h3>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${transaction.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${parseFloat(item.price).toFixed(2)}</td>
                        <td>₹${item.total.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="totals">
            <p class="total-row">Total: ₹${transaction.total.toFixed(2)}</p>
        </div>
    `;
}

// Download invoice as PDF
function downloadInvoicePDF() {
    if (!currentInvoice) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${currentInvoice.invoiceNumber}`, 20, 35);
    doc.text(`Date: ${formatDate(currentInvoice.date)}`, 20, 42);
    doc.text('Studio Billing System', 150, 35);
    doc.text('Billing Application', 150, 42);

    // Items table
    const tableData = currentInvoice.items.map(item => [
        item.name,
        item.quantity.toString(),
        `₹${parseFloat(item.price).toFixed(2)}`,
        `₹${item.total.toFixed(2)}`
    ]);

    doc.autoTable({
        startY: 50,
        head: [['Item', 'Quantity', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [102, 126, 234] }
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: ₹${currentInvoice.total.toFixed(2)}`, 150, finalY);

    // Save PDF
    doc.save(`Invoice_${currentInvoice.invoiceNumber}.pdf`);
    showToast('PDF downloaded successfully');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Current invoice for printing/downloading
let currentInvoice = null;


# Studio Billing Application

A complete billing application for studio businesses with product management, shopping cart, invoice generation, and sales reporting.

## Features

- **User Authentication**: Multi-user login and registration system
- **Product Management**: Full CRUD operations for products
  - Categories: Flex, Frame, Litho, Visiting Card, Invitation, etc.
  - Product fields: Name, Price, Image URL, Category, Description, Stock Quantity
- **Shopping Cart**: Add products to cart, manage quantities, calculate totals
- **Invoice Generation**: 
  - Text-based invoices (printable)
  - PDF invoice generation
- **Monthly Sales Reports**: 
  - Filter by month
  - View statistics (total sales, transactions, items sold)
  - Top selling products
  - Export as PDF or text file

## Technology Stack

- **Frontend**: Plain HTML, CSS, JavaScript
- **Storage**: Browser localStorage
- **Libraries**: 
  - jsPDF (for PDF generation)
  - jsPDF-AutoTable (for formatted tables in PDFs)

## Setup Instructions

### Web Browser (Quick Start)

1. **Download/Clone** all files to a directory

2. **Open** `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)

3. **No server required** - The application runs entirely in the browser using localStorage

4. **First Time Setup**:
   - Register a new user account
   - Login with your credentials
   - Start adding products

### Android APK Build

To convert this web app to an Android APK:

1. **Prerequisites**: Install Node.js, Java JDK, and Android Studio
2. **Run build script**:
   - Windows: Double-click `build-apk.bat`
   - Mac/Linux: Run `chmod +x build-apk.sh && ./build-apk.sh`
3. **Follow instructions** in `BUILD_ANDROID_APK.md` for detailed steps
4. **Build APK** in Android Studio: `Build > Build Bundle(s) / APK(s)`

See `BUILD_ANDROID_APK.md` for complete Android build instructions.

## Usage Guide

### 1. Registration & Login
- Click "Register" to create a new account
- Fill in username, password, and email
- Login with your credentials

### 2. Adding Products
- Click "Products" in the navigation
- Click "+ Add Product" button
- Fill in product details:
  - Name: Product name
  - Price: Product price
  - Image URL: Paste an image URL (or use placeholder)
  - Category: Select from dropdown (Flex, Frame, Litho, etc.)
  - Description: Optional product description
  - Stock Quantity: Available stock
- Click "Save"

### 3. Shopping & Billing
- Browse products in the Products section
- Click on any product card to add it to cart
- View cart by clicking "Cart" in navigation
- Adjust quantities using +/- buttons
- Click "Pay Now" to generate invoice

### 4. Viewing Invoices
- Click "Invoices" in navigation
- Click on any invoice to view details
- Options available:
  - Print invoice
  - Download as PDF
  - Close

### 5. Sales Reports
- Click "Reports" in navigation
- Select a month from the dropdown
- View statistics and transaction details
- Export report as PDF or text file

## Data Storage

All data is stored in browser localStorage:
- `users`: User accounts
- `products`: Product catalog
- `transactions`: Invoice/transaction history
- `cart_[userId]`: User's shopping cart
- `currentUser`: Currently logged-in user

**Note**: Data is stored locally in your browser. Clearing browser data will remove all stored information.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari
- Opera

## File Structure

```
billing/
├── index.html          # Main HTML structure
├── styles.css          # All styling
├── script.js           # Main application logic
├── auth.js             # Authentication system
├── products.js         # Product CRUD operations
├── cart.js             # Shopping cart functionality
├── invoice.js          # Invoice generation
├── reports.js          # Sales reports
└── README.md           # This file
```

## Features in Detail

### Product Categories
- Flex
- Frame
- Litho
- Visiting Card
- Invitation
- (Can be extended)

### Invoice Features
- Automatic invoice number generation
- Date and time stamping
- Itemized billing
- Tax calculation (5%)
- Professional formatting

### Report Features
- Monthly filtering
- Total sales calculation
- Transaction count
- Items sold count
- Average order value
- Top 10 selling products
- Complete transaction history

## Troubleshooting

**Issue**: Products/images not displaying
- **Solution**: Ensure image URLs are valid and accessible. Use placeholder images if needed.

**Issue**: Data lost after browser restart
- **Solution**: This is normal - data is stored in localStorage. Make sure not to clear browser data.

**Issue**: PDF not generating
- **Solution**: Ensure internet connection for loading jsPDF library from CDN.

## Future Enhancements

Potential improvements:
- Customer management
- Multiple tax rates
- Discount codes
- Email invoice sending
- Data export/import
- Backup and restore functionality

## License

This is a free application for studio business use.

## Support

For issues or questions, please check the code comments or modify as needed for your specific requirements.


# NWIS Token Sale DApp - Refactored Version

A modern, modular Web3 DApp for the NexusWealth Investment Solutions (NWIS) token presale, built with Next.js, TypeScript, and Wagmi.

## 🚀 Recent Refactoring (v2.0)

This version features a complete refactoring of the token purchase component, breaking down a monolithic 1,825-line file into **19 smaller, manageable components**.

### 📊 Refactoring Statistics

- **Before**: 1 file, 1,825 lines
- **After**: 19 files, average ~50-100 lines each
- **Main Component**: Reduced from 1,825 to ~400 lines (78% reduction)
- **Files Created**: 19 new modular components

## 🏗️ Architecture

### Core Components

#### **Constants & Configuration**
- `lib/constants.ts` - Contract ABIs, addresses, network configurations
- `lib/types.ts` - TypeScript interfaces and type definitions
- `lib/currency-config.tsx` - Currency configuration with icons and colors
- `lib/token-purchase-utils.ts` - Utility functions for token operations

#### **Custom Hooks**
- `hooks/use-contract-data.ts` - Contract data fetching and state management
- `hooks/use-token-approval.ts` - ERC20 token approval logic and state
- `hooks/use-transaction-confirmation.ts` - Transaction monitoring and confirmation

#### **UI Components**
- `components/token-purchase/ProgressBar.tsx` - Sale progress and tier information
- `components/token-purchase/CurrencySelector.tsx` - Payment currency selection
- `components/token-purchase/AmountInput.tsx` - Amount input field
- `components/token-purchase/NwisAmountInput.tsx` - NWIS token amount input
- `components/token-purchase/PurchaseButton.tsx` - Main purchase/approve button
- `components/token-purchase/NetworkWarning.tsx` - Network validation warnings

#### **Dialog Components**
- `components/token-purchase/dialogs/NetworkSwitchDialog.tsx` - Network switching modal
- `components/token-purchase/dialogs/TransactionConfirmationDialog.tsx` - Transaction confirmation modal
- `components/token-purchase/dialogs/TokenPurchaseAgreementDialog.tsx` - TPA agreement modal

#### **Main Component**
- `components/token-purchase/TokenPurchaseNew.tsx` - Orchestrates all smaller components

## ✨ Key Features

### **Token Purchase Flow**
- Multi-currency support (ETH, USDT, USDC)
- Real-time price calculations
- Tiered pricing system
- Automated token approval for ERC20 tokens
- Transaction simulation and confirmation

### **Wallet Integration**
- ConnectKit for wallet connection
- MetaMask, WalletConnect, and other wallet support
- Network validation and switching
- Mobile-optimized wallet interactions

### **User Experience**
- Responsive design for all devices
- Real-time progress tracking
- Comprehensive error handling
- Loading states and user feedback
- Token Purchase Agreement (TPA) integration

## 🛠️ Technical Stack

- **Framework**: Next.js 15.5.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v2, ConnectKit
- **UI Components**: Shadcn/ui
- **Blockchain**: Ethereum (Sepolia Testnet)
- **State Management**: React Hooks

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RevaWealth/NWIS_Test.git
   cd NWIS_Test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.template .env.local
   ```
   Update the environment variables with your configuration.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                          # Next.js app directory
│   ├── token-purchase/          # Token purchase page
│   ├── api/                     # API routes
│   └── globals.css              # Global styles
├── components/                   # React components
│   └── token-purchase/          # Refactored token purchase components
│       ├── dialogs/             # Modal components
│       └── *.tsx                # UI components
├── hooks/                       # Custom React hooks
├── lib/                         # Utilities and constants
├── contracts/                   # Smart contracts
├── public/                      # Static assets
└── styles/                      # Additional styles
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Organization

The refactored code follows these principles:

1. **Single Responsibility**: Each component has one clear purpose
2. **Reusability**: Components can be used across the application
3. **Maintainability**: Easy to understand and modify
4. **Testability**: Individual components can be unit tested
5. **Performance**: Better tree-shaking and smaller bundle sizes

## 🐛 Bug Fixes

### Recent Fixes (v2.0.1)

- **Fixed**: "Review Transaction" button staying inactive after token approval
- **Improved**: Approval state management and synchronization
- **Enhanced**: Transaction simulation dependencies
- **Added**: Comprehensive debugging and error handling

## 📋 Testing

### Manual Testing

1. Connect wallet to Sepolia testnet
2. Select USDT or USDC as payment currency
3. Enter amount to purchase
4. Approve tokens and verify button activation
5. Complete transaction flow

### Browser Console

The application includes comprehensive logging for debugging:
- Approval state changes
- Simulation status
- Transaction progress
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [https://github.com/RevaWealth/NWIS_Test](https://github.com/RevaWealth/NWIS_Test)
- **Live Demo**: [http://localhost:3000](http://localhost:3000) (when running locally)
- **Documentation**: See `REFACTORING_SUMMARY.md` for detailed refactoring information

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ by the NexusWealth Development Team**
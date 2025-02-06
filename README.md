# Demeter

A decentralized platform for fractional farm ownership using tokenization, built on Base Testnet and powered by Safe{Core} Protocol accesivle on [demeter.estate](https://demeter.estate).

## Overview

Demeter allows users to purchase tokens representing fractional ownership of farms. The platform leverages Base network for low fees and fast transactions, while utilizing Safe's account abstraction.

## Key Features

- **Account Abstraction**: Passwordless authentication using ERC-4337 and passkeys
- **Safe Smart Accounts**: Each user gets a Safe smart account
- **USDC Payment**: Buy and sell farm tokens using USDC
- **Sponsored Transactions**: Users don't need to pay for transactions on the platform
- **Asset Dashboard**: Track farm token holdings and portfolio value

## Technical Stack

### Blockchain
- Network: Base (Ethereum L2)
- Smart Contracts: Solidity
  - ERC-20: Farm tokens
  - ERC-4337: Account abstraction
  - ERC-721: Farm NFTs (for whole farm representation)

### Infrastructure
- Safe{Core} Protocol
  - Account abstraction
  - Smart account management
  - Passkey authentication
  - Transaction Service API for history & queuing
- Infura: Node infrastructure
- Hardhat: Smart contract development and deployment
- Safe Transaction Service: Transaction history & balance tracking
- Pimlico: Account abstraction infrastructure platform for paymaster and bundler


### Frontend
- Framework: Next.js
- Language: TypeScript
- UI: React
- Material UI v6.1.7

## Core features

1. **Authentication**
   - Passwordless login using passkeys
   - Safe smart account creation/recovery

2. **Asset Management**
   - View farm token portfolio
   - Track balance and holdings

3. **Investing**
   - Browse farm token marketplace
   - Purchase tokens with USDC
   - Sell tokens to USDC

## Technical Implementation

### Smart Account Architecture
- Each user account is a Safe smart account
- All assets are stored in Safe vaults
- Account abstraction via ERC-4337
- USDC payment integration for token purchases
- Transaction history and queuing via Safe Transaction Service

### Safe Transaction Service Integration
- Transaction history tracking


## Development Setup

### Environment Configuration
- Network: Base Sepolia Testnet
- RPC URL: https://sepolia.base.org
- Chain ID: 84532
- Safe Transaction Service API: https://safe-transaction-base-sepolia.safe.global/

### Deployed Contracts
- Farm Factory: 0x489C7835862c55B4A00efE4C68B695d66009D6f7

### Key Dependencies
- Material UI v6.1.7
- Safe Protocol Kit v4.1.0
- Safe Relay Kit v3.1.0
- Safe Transaction Service API
- Ethers.js v6
- Hardhat v2.22.18
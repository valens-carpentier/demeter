# Demeter

A decentralized platform for fractional farm ownership using tokenization, built on Base network and powered by Safe{Core} Protocol.

## Overview

Demeter allows users to purchase tokens representing fractional ownership of farms. The platform leverages Base network for low fees and fast transactions, while utilizing Safe's account abstraction for enhanced security and user experience.

## Key Features

- **Account Abstraction**: Passwordless authentication using ERC-4337 and passkeys
- **Safe Smart Accounts**: Each user gets a Safe smart account for secure token custody
- **Farm Token Trading**: Buy and sell farm tokens using crypto
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
- Infura: Node infrastructure
- Truffle: Smart contract deployment

### Frontend
- Framework: Next.js
- Language: TypeScript
- UI: React

### Backend
- Framework: NestJS
- Language: TypeScript

## Core features

1. **Authentication**
   - Passwordless login using passkeys
   - Safe smart account creation/recovery

2. **Asset Management**
   - View farm token portfolio
   - Track balance and holdings

3. **Trading**
   - Browse farm token marketplace
   - Purchase tokens
     - Via crypto
   - Sell tokens
     - To crypto

## Technical Implementation

### Smart Account Architecture
- Each user account is a Safe smart account
- All assets are stored in Safe vaults
- Account abstraction via ERC-4337

### Integration Points
- Safe Passkey Authentication: [Safe Passkey Tutorial](https://docs.safe.global/advanced/passkeys/tutorials/react)

## MVP Scope
- Core trading functionality
- Safe account integration
- Basic portfolio management

## User Flow

### 1. Register with Safe Passkey
- As a user, I want to register to the platform using passkeys with Safe AA

### 2. Login with Passkeys
- As a user, I want to login to the platform using Safe AA passkeys

### 3. Marketplace
- As a user, I want to browse the marketplace to view available farm tokens for purchase

### 4. Purchase Farm Token
- As a user, I want to purchase a farm token to become a fractional owner of a farm

### 5. Portfolio
- As a user, I want to view my portfolio of farm tokens and track my investment
- As a user, I want to sell my farm token to other users

## Owner Flow

### 1. Login with Safe Passkey
- As an owner, I want to login to the platform using Safe AA passkeys

### 2. Create Farm
- As an owner, I want to create a farm to tokenize my farm with a farm token 
- As an owner, I want to see all farms I generated

### 3. Manage Farm
- As an owner, I want to manage my farm and track my investment
- As an owner, I want to change the price of my farm token if needed
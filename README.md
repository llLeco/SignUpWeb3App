# User Signup and Login System with Blockchain Integration

![GitHub top language](https://img.shields.io/github/languages/top/llLeco/SignUpWeb3App)
[![Last Update](https://img.shields.io/github/last-commit/llLeco/SignUpWeb3App)](https://github.com/llLeco/SignUpWeb3App/commits/main)
[![GitHub](https://img.shields.io/github/followers/llLeco?label=Follow&style=social)](https://github.com/llLeco)
[![Twitter Follow](https://img.shields.io/twitter/follow/Leco712?style=social)](https://twitter.com/Leco712)

## Description

This project provides a user signup and login solution integrated with the Hedera blockchain. It allows users to create Hedera wallets or import existing wallets during the signup process. Integration with Hedera provides the necessary security and decentralization for Web3 applications. The project was developed using Angular, Ionic, and NestJs technologies to ensure a rich and efficient user experience.

![showcase](https://github.com/llLeco/SignUpWeb3App/assets/80337869/42861341-a9ff-43d8-955a-b2fa6ceaa332)

## Features

- **User Signup with Hedera Wallet Creation:** Users can sign up on the platform, which includes the automatic creation of a Hedera wallet for them. This allows them to participate in the Web3 network and perform transactions securely.

- **Import Existing Hedera Wallet During Signup:** During the signup process, users have the option to import an existing Hedera wallet if they already have one. This offers flexibility for users who wish to use an existing wallet instead of creating a new one.

- **User Login from Existing Account:** Users can log in to their existing accounts using their credentials. This provides a simple and quick authentication experience to access their wallets and other related information.

- **Encryption and Decryption of Locally Stored Information:** Sensitive information stored locally, such as private keys and other confidential data, is encrypted to ensure security. Additionally, the platform allows decryption of this information when needed for interaction with the Hedera network.

## Technologies

- List of technologies and libraries used in the project:
  - Hedera Hashgraph
  - @hashgraph/sdk
  - MongoDB
  - Nest.js (Node.js)
  - Angular & Ionic Frameworks

## Prerequisites

- Node.js and npm installed.
- Hedera testnet wallet (Sign up and create a wallet here: https://portal.hedera.com/register)
- MongoDB database (Sign up and create a database here: https://www.mongodb.com/pt-br)

## Installation

1. Clone this repository.
```bash
git clone https://github.com/llLeco/SignUpWeb3App.git
```
2. Navigate to the backend directory:
```bash
cd SignUpApp-Backend/
```
3. Install dependencies:
```bash
npm install ou yarn install
```
4. Navigate to the frontend directory:
```bash
cd SignUpApp-Frontend/
```
5. Install dependencies:
```bash
npm install ou yarn install
```
6. Create a file named .env in the root of the backend project with this information:
```bash
 HEDERA_PRIVATE='SuaChavePrivadaHedera'
 HEDERA_ACCOUNT='SuaContaHedera' (0.0.xxxxxxxx)
 MONGODB_URL='URLDoBancoDeDadosMongoDB' (mongodb+srv://username:xxxxxxxxxxxx@clusterx.xxxxxx.mongodb.net/)
```

## How to Use

1. Inside the backend directory, start the server:
```bash
npm start ou yarn start
```
2. Inside the frontend directory, start the app:
```bash
ionic serve
```
3. Access the application at:
```bash
http://localhost:8000
```

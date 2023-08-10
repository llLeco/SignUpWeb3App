# Sistema de Cadastro e Login de Usuário com Integração Blockchain

Uma solução que permite o cadastro e login de usuários com a capacidade de criar ou importar uma carteira Hedera durante o processo de cadastro. Esse projeto é direcionado para aplicativos web3 que necessitam de carteiras individuais para cada usuário.

## Descrição

Este projeto oferece uma solução de Cadastro e Login de Usuário integrada com a blockchain Hedera. Ele permite aos usuários criar carteiras Hedera ou importar carteiras existentes durante o processo de cadastro. A integração com a Hedera fornece a segurança e a descentralização necessárias para aplicativos Web3. O projeto foi desenvolvido com as tecnologias Angular, Ionic e NestJs para garantir uma experiência de usuário rica e eficiente.

![showcase](https://github.com/llLeco/SignUpWeb3App/assets/80337869/42861341-a9ff-43d8-955a-b2fa6ceaa332)

## Funcionalidades

- **Cadastro de usuário com criação de carteira Hedera:** Os usuários podem se cadastrar na plataforma, o que inclui a criação automática de uma carteira Hedera para eles. Isso permite que eles participem da rede Web3 e realizem transações de forma segura.

- **Importação de Carteira Hedera existente durante o processo de cadastro:** Durante o processo de cadastro, os usuários têm a opção de importar uma carteira Hedera existente, caso já possuam uma. Isso oferece flexibilidade aos usuários que desejam usar uma carteira existente em vez de criar uma nova.
- **Login de Usuário a Partir de Conta Existente:** Os usuários podem fazer login em suas contas existentes usando suas credenciais. Isso proporciona uma experiência de autenticação simples e rápida para acessar suas carteiras e outras informações relacionadas.
- **Criptografia e Descriptografia de Informações Armazenadas no localhost:**As informações sensíveis armazenadas localmente, como chaves privadas e outros dados confidenciais, são criptografadas para garantir a segurança. Além disso, a plataforma permite descriptografar essas informações quando necessário para uso na interação com a rede Hedera.

## Tecnologias

- Lista de tecnologias e bibliotecas utilizadas no projeto:
  - Hedera Hashgraph
  - @hashgraph/sdk
  - Mongodb
  - Nest.js (Node.js)
  - Angular & Ionic Frameworks

## Pré-requisitos

- Node.js e npm instalados.
- Carteira Hedera testnet (Cadastre-se e crie uma carteira aqui: https://portal.hedera.com/register)
- Banco de dados Mongodb (Cadastre-se e crie um banco de dados aqui: https://www.mongodb.com/pt-br)

## Instalação

1. Clone este repositório.
2. Navegue para o diretório backend: `cd SignUpApp-Backend/`.
3. Instale as dependências: `npm install` ou `yarn install`.
4. Navegue para o diretório frontend: `cd SignUpApp-Frontend/`
5. Instale as dependências: `npm install` ou `yarn install`.
6. Crie um arquivo chamado .env dentro da raiz do projeto backend com estas informações:
  HEDERA_PRIVATE='SuaChavePrivadaHedera'
  HEDERA_ACCOUNT='SuaContaHedera' (0.0.xxxxxxxx)
  MONGODB_URI='URLDoBancoDeDadosMongoDB' (mongodb+srv://username:xxxxxxxxxxxx@clusterx.xxxxxx.mongodb.net/)

## Como Usar

1. Dentro do diretório backend inicie o servidor: `npm start` ou `yarn start`.
2. Dentro do diretório frontend inicie o app: `ionic serve`
3. Acesse o aplicativo em: `http://localhost:8000`

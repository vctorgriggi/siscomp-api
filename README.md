## 🚀 Descrição

API Node.js com Express e Sequelize para um Sistema de Compras, facilitando o gerenciamento de fornecedores, contatos, produtos, cotações e requisições de compra, além de incluir controle de usuários, permissões e envio de emails.

## 📋 Funcionalidades

- **Gerenciamento de Fornecedores e Contatos:** Permite a criação, atualização e remoção de fornecedores e seus respectivos contatos.
- **Cadastro e Controle de Produtos:** Facilita o gerenciamento do cadastro e detalhes dos produtos.
- **Requisições de Compra:** Permite a criação, acompanhamento e gerenciamento de requisições de compra.
- **Criação e Gestão de Cotações:** Possibilita a criação e comparação de cotações de diferentes fornecedores.
- **Upload e Manipulação de Imagens:** Suporte para upload de imagens e manipulação através dos serviços da AWS.
- **Controle de Acesso:** Define níveis de acesso e permissões para diferentes usuários.
- **Autenticação de Usuários:** Implementação de login e controle de sessão.
- **Envio de Emails:** Suporte para envio de emails através do Nodemailer, útil para redefinição de senha e outras notificações.

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- Sequelize
- SQLite3 (para desenvolvimento)
- PostgreSQL (para produção)
- AWS SDK
- JSON Web Tokens (JWT)
- bcryptjs
- Nodemailer

## 📦 Como Rodar o Projeto

Siga os passos abaixo para rodar a API localmente

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/vctorgriggi/siscomp-api
    ```

2.  **Navegue até o diretório do projeto:**

    ```bash
    cd siscomp-api
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    ```

4.  **Configure as variáveis de ambiente:**

    #### Para Desenvolvimento

    1. Renomeie o arquivo `.env.development.local.example` para `.env.development.local` e preencha os valores adequados.

    #### Para Produção

    1. Renomeie o arquivo `.env.example` para `.env` e preencha os valores adequados.

5.  **Realize as migrações do banco de dados:**

    #### Para Desenvolvimento (usando SQLite3)

    ```bash
    npx sequelize db:migrate
    ```

    #### Para Produção (usando PostgreSQL)

    1. Certifique-se de ter criado o banco de dados (caso necessário):

    ```bash
    npx sequelize db:create
    ```

    2. Realize as migrações:

    ```bash
    npx sequelize db:migrate
    ```

6.  **Inicie a API:**

    #### Para Desenvolvimento (usando node --watch)

    ```bash
    npm run start:dev
    ```

    #### Para Produção

    ```bash
    npm run start
    ```

7.  **Acesse a API.**

    A API estará disponível em `http://localhost:3333`.

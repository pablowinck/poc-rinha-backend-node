# Projeto POC para Rinha - API RESTful com Node.js, Prisma e Docker

Este projeto é uma prova de conceito (POC) de uma API RESTful simples usando Node.js, Prisma e Docker. O projeto é parte da submissão para a competição "Rinha". Este README servirá como um guia rápido para executar o projeto.

## Pré-requisitos

- Docker
- Docker Compose
- Node.js
- NPM

## Setup do Projeto

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
```

### 2. Iniciar o PostgreSQL com Docker Compose

```bash
docker-compose up -d
```

Isso iniciará o PostgreSQL como definido no arquivo `docker-compose.yml`.

### 3. Instale as Dependências

```bash
npm install
```

### 4. Configurar e Gerar o Cliente Prisma

Crie um arquivo `.env` na raiz do projeto e adicione a string de conexão do PostgreSQL.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
```

Gere o cliente Prisma:

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Executar o Servidor

```bash
npm start
```

Isso iniciará o servidor na porta 3000.

### 6. Executar via Docker

```bash
docker build -t rinha-api .
docker-compose up -d
```

Isso iniciará o servidor o nginx 9999.

## Endpoints

### Criação de Pessoas (POST /pessoas)

Envie um JSON com os dados da pessoa.

Exemplo:

```bash
curl --request POST \
  --url http://localhost:3000/pessoas \
  --header 'Content-Type: application/json' \
  --data '{
	"apelido": "ana",
	"nome": "Ana Barbosa",
	"nascimento": "1985-09-23",
	"stack": ["Node", "Postgres"]
}'
```

### Consulta por ID (GET /pessoas/:id)

Para buscar um recurso por ID.

```bash
curl http://localhost:3000/pessoas/5ce4668c-4710-4cfb-ae5f-38988d6d49cb
```

### Busca por Termo (GET /pessoas?t=:termo)

Para fazer uma busca em todos os campos.

```bash
curl http://localhost:3000/pessoas?t=ana
```

### Contagem de Pessoas (GET /contagem-pessoas)

Para obter o número total de pessoas cadastradas.

```bash
curl http://localhost:3000/contagem-pessoas
```

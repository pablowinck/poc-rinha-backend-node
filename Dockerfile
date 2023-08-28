# Use a imagem oficial do Node.js
FROM node:20

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie os arquivos locais para o container
COPY . .

# Gere o Prisma Client
RUN npx prisma generate


# Torne nosso script de entrada executável
RUN chmod +x /app/entrypoint.sh

# Exponha a porta que o app usa
EXPOSE 3000

# Use um script de entrada para rodar as migrações
ENTRYPOINT ["/app/entrypoint.sh"]
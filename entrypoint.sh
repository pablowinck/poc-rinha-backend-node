#!/bin/sh
# entrypoint.sh

# Rodar migrações do Prisma
npx prisma migrate dev --preview-feature

# Iniciar a aplicação
npm start

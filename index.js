const http = require("http");
const url = require("url");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

http
  .createServer(async (req, res) => {
    const requestUrl = url.parse(req.url, true);
    const { pathname, query } = requestUrl;

    res.setHeader("Content-Type", "application/json");

    if (pathname === "/pessoas" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const data = JSON.parse(body);
          const dataNascimento = new Date(data.nascimento);
          if (isNaN(dataNascimento.getTime())) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: "Data de nascimento inválida" }));
            return;
          }
          const newUser = await prisma.user.create({
            data: { ...data, nascimento: dataNascimento },
          });
          res.end(JSON.stringify(newUser));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    } else if (pathname.startsWith("/pessoas/") && req.method === "GET") {
      const id = pathname.split("/")[2];
      try {
        const user = await prisma.user.findUnique({
          where: { id },
        });
        if (!user) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Usuário não encontrado" }));
          return;
        }
        res.end(JSON.stringify(user));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: error.message }));
      }
    } else if (pathname === "/pessoas" && req.method === "GET") {
      const searchTerm = query.t;
      if (searchTerm) {
        try {
          const results = await prisma.user.findMany({
            where: {
              OR: [
                { nome: { contains: searchTerm } },
                { apelido: { contains: searchTerm } },
                { stack: { hasSome: searchTerm.split(",") } },
              ],
            },
          });
          res.end(JSON.stringify(results));
        } catch (error) {
          console.error(error);
          res.writeHead(400);
          res.end(JSON.stringify({ error: error.message }));
        }
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Termo da busca não fornecido" }));
      }
    } else if (pathname === "/contagem-pessoas" && req.method === "GET") {
      try {
        const count = await prisma.user.count();
        res.end(JSON.stringify({ count }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: error.message }));
      }
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Rota não encontrada" }));
    }
  })
  .listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000/");
  });

const http = require("http");
const url = require("url");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const cacheListById = new Map();
const cacheListByTerm = new Map();
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
          let data = JSON.parse(body);
          if (
            isInvalidField(data?.apelido) ||
            isInvalidField(data?.nome) ||
            isInvalidField(data?.nascimento) ||
            typeof data?.apelido !== 'string' ||
            typeof data?.nome !== 'string' ||
            data?.nome?.length > 100 ||
            data?.apelido?.length > 32
          ) {
            res.writeHead(422);
            res.end();
            return;
          }
          if (isDateTypeInvalid(data.nascimento)) {
            res.writeHead(400);
            res.end();
            return;
          }
          if (isInvalidDate(data.nascimento)) {
            res.writeHead(422);
            res.end();
            return;
          }
          if (!!data?.stack) {
            if (
              !Array.isArray(data.stack) ||
              data.stack
                .filter((item) => new Boolean(item))
                .some((item) => typeof item !== "string")
            ) {
              res.writeHead(400);
              res.end();
              return;
            }
            if (data.stack.some((item) => item.length >= 33)) {
              res.writeHead(422);
              res.end();
              return;
            }
            data.stack = JSON.stringify(data.stack);
          }
          const dataNascimento = new Date(data.nascimento);
          const userCreated = await prisma.user.create({
            data: { ...data, nascimento: dataNascimento },
          });
          if (cacheListById.size > 1000) {
            cacheListById.delete(cacheListById.keys().next().value);
          }
          cacheListById.set(userCreated.id, userCreated);
          res.statusCode = 201;
          res.setHeader("Location", `/pessoas/${userCreated.id}`);
          res.end();
        } catch (error) {
          res.writeHead(400);
          res.end();
        }
      });
    } else if (pathname.startsWith("/pessoas/") && req.method === "GET") {
      const id = pathname.split("/")[2];
      try {
        let user;
        if (cacheListById.has(id)) {
          user = cacheListById.get(id);
        } else {
          user = await prisma.user.findUnique({
            where: { id },
          });
        }
        if (!user) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Usuário não encontrado" }));
          return;
        }
        res.end(
          JSON.stringify({
            ...user,
            nascimento: user.nascimento.toISOString().substring(0, 10),
            stack: user?.stack ? JSON.parse(user.stack) : null,
          }),
        );
      } catch (error) {
        res.writeHead(400);
        res.end();
      }
    } else if (pathname === "/pessoas" && req.method === "GET") {
      const searchTerm = query.t;
      if (searchTerm) {
        try {
          if (cacheListByTerm.has(searchTerm)) {
            res.end(cacheListByTerm.get(searchTerm));
            return;
          }
          const results = await prisma.user.findMany({
            where: {
              OR: [
                { nome: { contains: searchTerm } },
                { apelido: { contains: searchTerm } },
                { stack: { contains: searchTerm } },
              ],
            },
            take: 100,
          });
          const response = JSON.stringify(
            results.map((item) => ({
              ...item,
              nascimento: item.nascimento.toISOString().substring(0, 10),
              stack: item?.stack ? JSON.parse(item.stack) : null,
            })),
          );
          if (cacheListByTerm.size > 1000) {
            cacheListByTerm.delete(cacheListByTerm.keys().next().value);
          }
          cacheListByTerm.set(searchTerm, response);
          res.end(response);
        } catch (error) {
          res.writeHead(400);
          res.end();
        }
      } else {
        res.writeHead(400);
        res.end();
      }
    } else if (pathname === "/contagem-pessoas" && req.method === "GET") {
      try {
        const count = await prisma.user.count();
        res.end(JSON.stringify({ count }));
      } catch (error) {
        res.writeHead(400);
        res.end();
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000/");
  });

function isDateTypeInvalid(date) {
  return typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isInvalidDate(date) {
  try {
    const dateObj = new Date(date);
    if (!(dateObj instanceof Date && !isNaN(dateObj))) {
      return true;
    }

    // Convert the date object back to a YYYY-MM-DD string
    const generatedDate = dateObj.toISOString().split("T")[0];

    // Compare the generated date string with the input date string
    return generatedDate !== date;
  } catch (error) {
    return true;
  }
}

function isInvalidField(field) {
  return field === undefined || field === null;
}

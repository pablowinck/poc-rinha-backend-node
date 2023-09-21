-- CreateIndex
CREATE INDEX "User_apelido_nome_stack_idx" ON "User"("apelido", "nome", "stack");

-- CreateIndex
CREATE INDEX "User_apelido_idx" ON "User"("apelido");

-- CreateIndex
CREATE INDEX "User_nome_idx" ON "User"("nome");

-- CreateIndex
CREATE INDEX "User_stack_idx" ON "User"("stack");

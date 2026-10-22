// Chave enviada no cabecalho Idempotency-Key: uma por intencao do morador.
// Reenviar o mesmo pedido com a mesma chave nao debita pontos de novo.
export const newIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
};

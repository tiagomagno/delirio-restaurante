# ─── Dependências ───────────────────────────
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ─── Build ──────────────────────────────────
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ─── Runtime ────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 3000
# Se o start falhar, mantém o container vivo por 1h imprimindo o erro,
# pra dar tempo de ler o log em Runtime Logs antes do container cair.
# TODO: remover esse fallback de debug depois de identificar a causa do crash.
CMD ["sh", "-c", "npm run start || (echo '--- START FALHOU, veja o erro acima. Container ficara vivo por 1h para debug. ---'; sleep 3600)"]

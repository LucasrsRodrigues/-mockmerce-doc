# syntax=docker/dockerfile:1

# ============================================================================
# Hub de documentação (Docusaurus). Multi-stage:
#   Stage 1 (build):   gera o site estático (build/).
#   Stage 2 (runtime): Nginx serve os arquivos estáticos.
# URL pública / baseUrl podem ser sobrescritos por build args (DOCS_URL / DOCS_BASE_URL).
# ============================================================================

# ---------- Stage 1: build ----------
FROM node:20-slim AS build
WORKDIR /app

# Repassados ao Docusaurus (docusaurus.config.ts lê process.env com fallback).
ARG DOCS_URL
ARG DOCS_BASE_URL
ENV DOCS_URL=${DOCS_URL}
ENV DOCS_BASE_URL=${DOCS_BASE_URL}

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Stage 2: runtime ----------
FROM nginx:1.27-alpine AS runtime
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

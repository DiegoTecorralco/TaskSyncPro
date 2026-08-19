# =============================================
# 1. Etapa de construcción: Node.js + Python
# =============================================
FROM node:20-alpine AS builder

# Instalar Python y dependencias del sistema
RUN apk add --no-cache python3 py3-pip python3-dev build-base

WORKDIR /app

# Copiar solo los archivos de dependencias (NO el código fuente)
COPY Deliverables/API/sourse/package*.json ./
RUN npm install

# Copiar solo el requirements.txt de Python
COPY Deliverables/API/sourse/ml_engine/requirements.txt ./ml_engine/
RUN cd ml_engine && python3 -m venv venv && \
    . venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt

# =============================================
# 2. Etapa final: Imagen ligera
# =============================================
FROM node:20-alpine

# Instalar Python
RUN apk add --no-cache python3

WORKDIR /app

# Copiar las dependencias desde la etapa builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/ml_engine/venv ./ml_engine/venv

# Ahora copiar el código fuente (esto es ligero porque ya ignoramos lo pesado)
COPY Deliverables/API/sourse ./

EXPOSE 3000

CMD ["npm", "start"]
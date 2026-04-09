FROM node:20-slim

# Install Chromium + ffmpeg + curl (required by Remotion)
RUN apt-get update && apt-get install -y \
  chromium \
  ffmpeg \
  curl \
  fonts-liberation \
  fonts-noto-color-emoji \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Set Chromium path for Remotion
ENV CHROMIUM_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# Copy package files and install
COPY package.json ./
RUN npm install --omit=dev

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY server.js remotion.config.ts tsconfig.json download-assets.sh ./
RUN chmod +x download-assets.sh

# Download audio assets at build time
RUN bash download-assets.sh

# Create output directory
RUN mkdir -p out

# HF Spaces expects port 7860
ENV PORT=7860
EXPOSE 7860

CMD ["node", "server.js"]

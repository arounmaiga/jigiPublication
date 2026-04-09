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
RUN npm install

# Copy all source files
COPY src/ ./src/
COPY public/ ./public/
COPY server.js remotion.config.ts tsconfig.json download-assets.sh ./
RUN chmod +x download-assets.sh

# Download audio assets and verify
RUN bash download-assets.sh && ls -la public/

# Pre-bundle Remotion to cache the webpack build
RUN npx remotion bundle --public-dir=public || true

# Create output directory
RUN mkdir -p out

# HF Spaces expects port 7860
ENV PORT=7860
EXPOSE 7860

CMD ["bash", "-c", "bash download-assets.sh && node server.js"]

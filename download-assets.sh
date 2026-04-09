#!/bin/bash
mkdir -p public
echo "Downloading audio assets..."
curl -sL "https://files.catbox.moe/3u8znz.mp3" -o public/aminata-voiceover.mp3
curl -sL "https://files.catbox.moe/0qxh0p.mp3" -o public/kora-background.mp3
echo "Assets ready."

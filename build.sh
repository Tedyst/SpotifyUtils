#/bin/bash
cd frontend
npm run build
cd ..
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 --push -t ghcr.io/tedyst/spotifyutils .
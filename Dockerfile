FROM node:lts-buster

RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i 's|security.debian.org|archive.debian.org/debian-security|g' /etc/apt/sources.list && \
    echo "deb http://archive.debian.org/debian buster contrib main non-free" > /etc/apt/sources.list.d/archive.list && \
    apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp && \
    rm -rf /var/lib/apt/lists/*

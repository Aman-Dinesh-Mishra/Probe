FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 \
    nodejs \
    npm \
    g++ \
    default-jdk \
    r-base \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /exec

WORKDIR /workspace

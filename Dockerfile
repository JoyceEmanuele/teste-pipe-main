FROM node:latest

WORKDIR /home/node/app

RUN apt update
RUN apt install git

USER node

# Configura o diretório do NPM GLOBAL para a pasta do usuário node
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Instala o NESTJS globalmente
RUN npm i -g @nestjs/cli

CMD [ "tail", "-f", "/dev/null" ]

# MainService

O projeto mainservice foi criado com o intuito de migrarmos alguns serviços, até o momento do api-async do API-Server, para o seu repositório. Dessa forma, manteremos o MainService como nosso serviço principal do back-end. 
Como exemplo, o main-service tem dentre os seus modulos, o serviço de armazenamento de notificações do Feed de Notificações.

## Nest JS

O Nest.js é um framework de crescimento rápido para construir aplicativos backend eficientes, escaláveis e de nível empresarial usando o Node.js. Ele é conhecido por produzir aplicativos altamente testáveis, de fácil manutenção e escaláveis utilizando JavaScript e TypeScript modernos.

O Nest.js combina abordagens modernas e modulares com princípios de engenharia de software. Ele utiliza o TypeScript para verificação de tipos e oferece uma arquitetura de software pronta para construir e implantar aplicativos testáveis, escaláveis, com baixo acoplamento e fácil manutenção.

Mais sobre suas características encontramos em sua documentação [Nest.js](https://docs.nestjs.com/)

### ⚙️ Ferramentas

Para a aplicação utilizamos as seguintes ferramentas:

- [Swagger](https://docs.nestjs.com/openapi/introduction) _ Documentação das APIs com Swagger 
- [Prisma](https://docs.nestjs.com/recipes/prisma) _ ORM Prisma com esquema de migration
- [ClassValidator](https://docs.nestjs.com/techniques/validation) _ Validação dos dados no backend 
- [HttpModule](https://docs.nestjs.com/techniques/http-module) _ Requisições em outros serviços
- [Jest](https://docs.nestjs.com/fundamentals/testing) _ Testes unitários 
- [Guards](https://docs.nestjs.com/guards) _ Sistema de autenticação 

## Arquitetura

O projeto mainservice foi construído seguindo alguns fundamentos de clean code em sua arquitetura: dentre eles está Hexagonal Architecture.  
O sentido de utilizarmos esse conceito é darmos o máximo de melhorias aos pontos de: manutenibilidade, modularidade, usabilidade, legibilidade e testes.

O exemplo abaixo refere-se basicamente o que iremos tratar em nossa arquitetura. No qual manteremos nossos casos de uso e entidades intactas e mudaremos apenas o meio em que os acessamos. Para isso, utilizamos dois conceitos: adaptadores e portas. Uma boa leitura sobre esse conceito está no blog [Clean Coder Blog](https://www.docker.com/) onde podemos nos aprofundar melhor no assunto.

![image](https://github.com/dielenergia/main-service/assets/40302980/44ffd07c-2055-48e2-a115-cd3abf551af4)

## 1. Requerimentos

Para o desenvolvimento, estamos utilizando um container `Docker` para subirmos o nosso serviço `mainservice` e um banco de dados `PostgreSQL` localmente. 

Dessa forma, é necessário 

- [Docker](https://www.docker.com/) Para subir os serviços com o arquivo `docker-compose` (node + postgres).

## 2. Organizando ambiente

### 2.1. Setar variáveis de ambientes

- Crie um arquivo `.env` para setar as variáveis de ambiente definidas como no arquivo `.env_example`
- Certifique-se que o campo `seu.ip.aqui` esteja substituído pelo ip da sua máquina (visualize com ipconfig). 

```bash
DATABASE_URL="postgresql://root:root@host.docker.internal:5433/mainservice"

SERVER_TEST='true'
SERVER_PRODUCTION='false'

API_GATEWAY_URL_PROD="https://api.dielenergia.com"
API_GATEWAY_URL_QA="https://api-qa.dielenergia.com"
API_GATEWAY_URL_LOCAL="seu.ip.aqui:46101/"

API_GATEWAY_URL="seu.ip.aqui:46101/"
API_SERVER_URL="seu.ip.aqui:8445/"
```

### 2.2. Instalando dependências

```bash
$ npm install
```
### 2.3. Iniciar os contêineres

```bash
# subir os serviços com docker-compose e analisar os logs na console
docker-compose up 

# Caso queira iniciar os contêiners em modo background, sem visualizar os logs na console
docker-compose up -d

# Caso tenha iniciado o ambiente em modo background existe uma forma de analisar os logs do contêiner em execução:
docker logs -f mainservice
```

### 2.3. Entrar no container do serviço

```bash
$ docker-compose exec mainservice bash
```

### 2.4. Rodar as migrations e seed

```bash
$ npx prisma migrate dev
```

OBS: 
Caso você queira atualizar futuramente seu banco com as migrations:
```bash
$ npx prisma migrate dev
```
Caso você queira atualizar futuramente seu bancp com a seed:
```bash
$ npx prisma db seed
```

### 2.5. Iniciando
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```



## 3. Testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

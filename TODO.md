# Conecta Emprego Paranoá - Controle de Tarefas

Este arquivo serve para acompanhar o progresso do desenvolvimento do projeto de forma transparente.

## Status Geral
- [x] **Fase 1: Configuração Inicial e Git**
- [x] **Fase 2: API Backend (NestJS + Prisma + MySQL)**
- [x] **Fase 3: Frontend App (Angular + Tailwind CSS)**
- [x] **Fase 4: Infraestrutura (Docker & Orchestration)**
- [/] **Fase 5: Verificação e Testes Finais**

---

## Detalhamento das Atividades

### 1. Configuração Inicial e Versionamento Git
- [x] Inicializar o repositório Git local.
- [x] Criar o arquivo `.gitignore` na raiz do projeto.
- [x] Realizar o primeiro commit com a estrutura inicial de diretórios.

### 2. API Backend (`/api`)
- [x] Inicializar o esqueleto do projeto NestJS na pasta `/api` via container Node.js.
- [x] Configurar o **Prisma ORM** e criar o schema do banco de dados (Entidade `Job`).
- [x] Implementar o `PrismaService` para gerenciar a conexão com o MySQL.
- [x] Implementar o `JobsModule`, `JobsService` e `JobsController`:
  - [x] Rota `GET /jobs` para recuperar as vagas ordenadas por data de criação (mais recente primeiro).
  - [x] Rota `POST /jobs` para cadastrar uma nova vaga com validação de campos.
- [x] Habilitar o CORS no arquivo `main.ts` do NestJS para aceitar chamadas do frontend.
- [x] Escrever o `Dockerfile` otimizado para o backend do NestJS.

### 3. Frontend App (`/app`)
- [x] Inicializar o esqueleto do projeto Angular na pasta `/app` via container Node.js.
- [x] Instalar e configurar o **Tailwind CSS** no projeto Angular.
- [x] Implementar a integração com o back-end via `HttpClient` (criar o `JobService`).
- [x] Desenvolver a interface visual moderna e responsiva (Mobile-First) baseada em Azul e Branco (Design de Confiança):
  - [x] **Navbar/Cabecalho**: Logotipo simples, elegante e descrição da iniciativa.
  - [x] **Feed de Vagas**: Visualização em lista/cards limpos com botão "Tenho Interesse" (redirecionamento WhatsApp).
  - [x] **Painel do Comerciante**: Formulário enxuto de publicação com validação de campos em tempo real.
- [x] Escrever o `Dockerfile` otimizado para o frontend do Angular (servidor de desenvolvimento local).

### 4. Infraestrutura e Orquestração (`/infra`)
- [x] Criar o arquivo `docker-compose.yml` na pasta `/infra` expondo as portas 4200 (App), 3000 (API) e 3306 (MySQL).
- [x] Configurar volumes persistentes para o MySQL.
- [x] Criar scripts de inicialização automática (`start.sh`) que rodam migrations e sobem o ecossistema com um único comando.

### 5. Validação e Entrega
- [/] Validar a compilação do TypeScript no front e back-end.
- [ ] Testar o fluxo completo de publicação de vaga e exibição em tempo real no feed.
- [ ] Finalizar o versionamento Git local, realizar os commits finais e criar o Walkthrough de entrega.

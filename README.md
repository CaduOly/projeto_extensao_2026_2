# Conecta Emprego Paranoá 💼

O **Conecta Emprego Paranoá** é uma aplicação web full-stack desenvolvida para promover a **Inclusão Econômica e o Empreendedorismo**. Alinhado ao **ODS 8 (Trabalho Decente e Crescimento Econômico)** da ONU, o sistema tem como objetivo principal conectar jovens da comunidade do Paranoá a pequenos comerciantes locais para divulgação de vagas formais e oportunidades de "bicos".

---

## 🚀 Arquitetura e Stack Tecnológica

O ecossistema é totalmente conteinerizado e dividido de forma estrita em três pilares na raiz do repositório:

1.  **Frontend (`/app`)**: Desenvolvido em **Angular (v19+)** utilizando componentes autônomos (*standalone*), **TypeScript** e **Tailwind CSS (v4)** para uma interface mobile-first moderna, limpa e responsiva. Possui o visual personalizado em tons de azul e branco para inspirar confiança e profissionalismo.
2.  **Backend (`/api`)**: Desenvolvido em **NestJS**, utilizando **TypeScript**, **Prisma ORM (v7)** e **class-validator** para validação robusta de segurança das rotas.
3.  **Banco de Dados**: Servidor **MySQL (v8.0)** para persistência ágil e segura das vagas.
4.  **Infraestrutura (`/infra`)**: Orquestração completa por meio do **Docker Compose** e scripts automatizados de inicialização.

---

## 📁 Estrutura de Diretórios

```text
/projeto_extensao_2026_2
├── app/               # Código do Frontend Angular e Dockerfile
├── api/               # Código do Backend NestJS, Schema Prisma e Dockerfile
├── infra/             # Orquestração (docker-compose.yml e scripts)
│   ├── docker-compose.yml
│   └── start.sh       # Script orquestrador principal de execução
├── README.md          # Documentação do projeto (Este arquivo)
└── TODO.md            # Painel local de controle das atividades concluídas
```

---

## 🛠️ Pré-requisitos

Para rodar este projeto, você precisa ter instalado apenas em sua máquina host:

*   **Docker** (versão 20.10 ou superior)
*   **Docker Compose** (plugin integrado `docker compose` ou executável isolado `docker-compose`)

> 💡 **Nota**: Não é necessário ter o Node.js, npm, Angular CLI ou MySQL instalados localmente na sua máquina! O ambiente Docker cuida de todo o processo de instalação de dependências, compilação do TypeScript e sincronização de dados de forma 100% isolada.

---

## 🏁 Passo a Passo para Executar o Projeto

Siga os passos abaixo para subir todo o ecossistema com um único comando:

### Passo 1: Abrir o Terminal
Abra o seu terminal e navegue até a pasta raiz do projeto:
```bash
cd /caminho/para/projeto_extensao_2026_2
```

### Passo 2: Executar o Script Orquestrador
Demos permissão de execução para o script de inicialização inteligente. Basta rodar:
```bash
./infra/start.sh
```

> **O que este script faz automaticamente por você?**
> 1. Limpa contêineres e volumes antigos do MySQL para evitar conflitos de dados.
> 2. Constrói as imagens customizadas do Angular e do NestJS.
> 3. Sobe o banco MySQL e aguarda a inicialização completa (usando a diretiva *healthcheck*).
> 4. Executa a sincronização do banco de dados (`npx prisma db push`) criando a tabela `Job` automaticamente.
> 5. Inicializa os servidores web e expõe as portas de acesso.

---

## 🌐 Portas de Acesso e Endereços

Assim que a inicialização do Docker terminar, os seguintes serviços estarão disponíveis:

*   **Aplicativo Web (Frontend)**: [http://localhost:4200](http://localhost:4200)
*   **API Gateway (Backend)**: [http://localhost:3000](http://localhost:3000) (Acessar a raiz retornará a mensagem de verificação: *"Conecta Emprego Paranoá API is online!"*)
*   **Banco de Dados (MySQL)**: Porta `3306` (Acessível via localhost usando o usuário `conecta_user` e a senha `conecta_password`)

---

## 🧪 Roteiro de Teste E2E (Ponta a Ponta)

Para validar a integração completa das tecnologias, siga o roteiro de testes abaixo:

1.  **Acessar a Interface**: Abra [http://localhost:4200](http://localhost:4200) no seu navegador (de preferência no modo de inspeção móvel para ver o layout mobile-first). O feed estará limpo informando que não há vagas.
2.  **Cadastrar uma Vaga (Visão do Comerciante)**:
    *   Clique na aba **"Sou Comerciante"** no cabeçalho.
    *   Preencha o formulário:
        *   **Título da Vaga**: `Entregador de Pizzaria`
        *   **Descrição**: `Vaga de bico aos finais de semana no Paranoá. Necessário ter moto própria e CNH ativa. Horário de 18h às 23h.`
        *   **Valor**: `R$ 80,00 por dia + caixinha`
        *   **WhatsApp**: Digite `61987654321` (o sistema formatará automaticamente como `(61) 98765-4321` enquanto você digita).
    *   Clique em **"Publicar Vaga"**. Você verá uma animação de carregamento e o aviso de sucesso *"Vaga cadastrada com sucesso!"*.
3.  **Visualizar a Vaga (Visão do Jovem)**:
    *   O sistema irá redirecioná-lo automaticamente de volta para a aba **"Feed de Vagas"**.
    *   A vaga recém-criada aparecerá instantaneamente no topo da lista rolável, exibindo o título, data de publicação formatada, descrição, remuneração em destaque verde e os badges de localização.
4.  **Iniciar Contato (Ação de Interesse)**:
    *   Clique no botão verde **"Tenho Interesse"** no card da vaga.
    *   Você será redirecionado para uma nova aba do navegador abrindo o WhatsApp Web com o link `https://wa.me/5561987654321` pré-configurado com a mensagem personalizada em português:
        > *"Olá! Vi a vaga de \"Entregador de Pizzaria\" no Conecta Emprego Paranoá e tenho muito interesse."*

---

## 🧰 Comandos Úteis (Para Desenvolvedores)

Se você precisar mexer no código ou fazer manutenção durante o desenvolvimento:

*   **Parar todos os serviços**:
    No terminal aberto, aperte `Ctrl + C` ou execute de outra janela:
    ```bash
    docker compose -f infra/docker-compose.yml down -v
    ```
*   **Visualizar os Logs em tempo real**:
    ```bash
    docker compose -f infra/docker-compose.yml logs -f
    ```
*   **Regenerar o Cliente Prisma (se alterar o schema do banco)**:
    ```bash
    docker compose -f infra/docker-compose.yml exec api npx prisma generate
    ```

# 🕵️ Ordo Veritas - Sistema de Gestão de Missões

> "O paranormal não vem para a nossa realidade de maneira fácil... a Realidade tende a se curar."

Um sistema web imersivo *Full-Stack* desenvolvido para auxiliar narrativas do RPG de mesa **Ordem Paranormal**. A aplicação serve como um "hub" digital onde o Mestre pode gerenciar documentos e pistas, enquanto os jogadores acessam um banco de dados interativo para investigar evidências em tempo real.

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Tech Stack](https://img.shields.io/badge/Stack-T3_App-blue)

## 💻 Sobre o Projeto

Este projeto foi criado para resolver a necessidade de compartilhar pistas visuais (mapas, documentos, fotos) de forma organizada e imersiva durante as sessões de RPG.

O sistema é dividido em duas interfaces:
1.  **Terminal do Mestre (Admin):** Painel protegido por senha onde o narrador cria missões, faz upload de pistas e controla a visibilidade (revelar/esconder) de cada item.
2.  **Base de Dados (Pública):** Interface responsiva para os jogadores visualizarem as pistas reveladas pelo mestre, simulando um acesso a um sistema de investigação.

## ✨ Funcionalidades

### 🔐 Área Administrativa (Mestre)
* **Autenticação Segura:** Proteção de rota via Middleware e Cookies (Senha mestra).
* **Gestão de Missões:** Criar, editar e arquivar pastas de casos.
* **Gestão de Evidências:** Adicionar links de imagens e descrições.
* **Controle de Visibilidade:** Botão "Revelar" que atualiza instantaneamente o que os jogadores podem ver.
* **Design Responsivo:** Painel totalmente funcional em celulares e tablets.

### 🕵️ Área Pública (Jogadores)
* **Imersão Visual:** Interface estilo "Terminal Hacker" / Dossiê.
* **Zoom de Alta Qualidade:** Visualização detalhada de documentos sem perda de qualidade.
* **Mobile-First:** Layout adaptável para consulta rápida via celular durante a sessão.
* **Feedback Visual:** Indicadores de novas evidências e status das missões.

## 🛠️ Tecnologias Utilizadas (T3 Stack)

O projeto foi construído utilizando as melhores práticas do desenvolvimento web moderno:

* **[Next.js 15](https://nextjs.org/)**: Framework React com App Router e Server Actions.
* **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para segurança do código.
* **[Tailwind CSS](https://tailwindcss.com/)**: Estilização utilitária para design rápido e responsivo.
* **[tRPC](https://trpc.io/)**: Comunicação *type-safe* entre Frontend e Backend.
* **[Prisma](https://www.prisma.io/)**: ORM para manipulação do banco de dados.
* **[MySQL](https://www.mysql.com/)**: Banco de dados relacional (Hospedado no Railway).
* **Zod**: Validação de esquemas e dados.

## 🚀 Como Rodar Localmente

Pré-requisitos: Node.js e gerenciador de pacotes (npm, pnpm ou yarn).

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/seu-usuario/ordem-rpg.git](https://github.com/seu-usuario/ordem-rpg.git)
    cd ordem-rpg
    ```

2.  **Instale as dependências**
    ```bash
    pnpm install
    ```

3.  **Configure as Variáveis de Ambiente**
    Crie um arquivo `.env` na raiz e preencha:
    ```env
    DATABASE_URL="mysql://usuario:senha@host:porta/banco"
    ADMIN_PASSWORD="sua_senha_secreta"
    ```

4.  **Sincronize o Banco de Dados**
    ```bash
    pnpm db:push
    ```

5.  **Inicie o Servidor**
    ```bash
    pnpm dev
    ```
    Acesse em `http://localhost:3000`.



Desenvolvido por **Alex Batista** *Estudante de Engenharia da Computação - UnB*

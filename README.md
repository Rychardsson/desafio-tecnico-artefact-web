# Desafio Técnico Artefact Web

Aplicação de gerenciamento de tarefas construída com Next.js, TypeScript, tRPC,
React Query e Zod. As tarefas são armazenadas em memória, conforme o escopo do
desafio; portanto, os dados são reiniciados quando o processo da aplicação é
reiniciado.

## Requisitos

- Node.js 20 ou superior
- npm

## Executando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Comandos disponíveis:

```bash
npm run lint    # verifica o código com ESLint
npm run build   # gera e valida o build de produção
npm start       # inicia o build de produção
```

## Funcionalidades

- Listagem de tarefas com pré-carregamento no servidor (SSR).
- Criação, edição e exclusão de tarefas.
- Validação de título obrigatório no frontend e no backend.
- Estados de carregamento e erro nas operações de formulário e exclusão.
- Infinite scroll com paginação por cursor e `IntersectionObserver`.
- Datas preservadas como `Date` entre servidor e cliente usando SuperJSON.

## Arquitetura

```text
app/
├── page.tsx                   # Listagem SSR
├── tasks/
│   ├── new/page.tsx           # Criação
│   └── [id]/edit/page.tsx     # Edição
└── api/trpc/[trpc]/route.ts   # Handler HTTP do tRPC
components/
├── TaskForm.tsx               # Formulário de criação e edição
└── TaskList.tsx               # Lista, exclusão e infinite scroll
lib/trpc/
├── client.tsx                 # Provider e cliente React do tRPC
└── server.ts                  # Caller para Server Components
server/
├── root.ts                    # Router raiz
├── trpc.ts                    # Contexto, transformer e erros
└── routers/task.ts            # CRUD e store em memória
```

O `task.list` retorna páginas de até 10 tarefas por padrão e usa o `id` da
última tarefa como cursor. A primeira página é carregada no Server Component e
entregue como `initialData` ao `useInfiniteQuery`; as páginas seguintes são
buscadas no cliente quando o sentinel observado pelo `IntersectionObserver`
entra na viewport.

## API tRPC

| Procedure | Tipo | Descrição |
|---|---|---|
| `task.list` | query | Lista tarefas paginadas por cursor |
| `task.create` | mutation | Cria uma tarefa |
| `task.update` | mutation | Atualiza uma tarefa existente |
| `task.delete` | mutation | Remove uma tarefa existente |

O endpoint HTTP está disponível em `/api/trpc`. Os procedimentos também são
chamados diretamente no servidor por meio de `createServerCaller`, evitando uma
requisição HTTP adicional durante o SSR.

## Segurança e configuração

Não há tokens, senhas ou chaves de API no projeto. Arquivos `.env*`, credenciais
e artefatos de build estão no `.gitignore`. A aplicação não possui autenticação,
pois ela não faz parte do escopo deste desafio.

## Repositório

O repositório público está disponível em
<https://github.com/Rychardsson/desafio-tecnico-artefact-web>.

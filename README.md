# Gerenciador de tarefas

Aplicação de gerenciamento de tarefas construída para o desafio técnico com
Next.js, TypeScript, tRPC, React Query e Zod. A interface e as mensagens estão
em português, e os campos do domínio seguem o case: `titulo`, `descricao` e
`dataCriacao`.

## Stack e versões

- Next.js `16.4.5` com App Router
- React `19.3.0`
- TypeScript `^5`
- tRPC `^11.23.0`
- TanStack React Query `^5.105.3`
- Zod `^4.6.7`
- Tailwind CSS `^4`
- Node.js 20 ou superior

## Como rodar

Com pnpm:

```bash
pnpm i
pnpm dev
```

Com npm:

```bash
npm install
npm run dev
```

Acesse <http://localhost:3000>.

Comandos de validação:

```bash
pnpm lint
pnpm build
pnpm test
```

No projeto, os comandos equivalentes via npm são `npm run lint`, `npm run
build` e `npm test`.

## Docker

```bash
docker build -t desafio-tecnico-artefact-web:local .
docker run --rm -p 3000:3000 desafio-tecnico-artefact-web:local
```

A imagem usa o modo standalone do Next.js, build multi-stage e executa o
processo com um usuário sem privilégios.

## Funcionalidades

- CRUD de tarefas.
- SSR dinâmico na listagem usando `createServerCaller`.
- Paginação por cursor e infinite scroll.
- Confirmação e feedback de exclusão.
- Feedback de sucesso e erro após criar, editar e excluir.
- Validação no cliente e no servidor.
- Páginas de erro e 404.
- Acessibilidade básica com labels, foco visível e `aria-live`.
- Testes do router com Vitest para validação, CRUD, erros e paginação.

## Arquitetura

```text
app/
├── page.tsx                   # Listagem SSR dinâmica
├── error.tsx                  # Erro global
├── not-found.tsx              # 404 global
├── tasks/
│   ├── new/page.tsx           # Criação
│   └── [id]/edit/page.tsx     # Edição
└── api/trpc/[trpc]/route.ts   # Handler HTTP do tRPC
components/
├── TaskForm.tsx               # Formulário de criação e edição
└── TaskList.tsx               # Lista, exclusão e infinite scroll
lib/trpc/
├── client.tsx                 # Provider e cliente React
└── server.ts                  # Caller para Server Components
server/
├── schemas/task.ts            # Schemas Zod
├── store/task.ts              # Store em memória e tipo Task
├── root.ts                    # Router raiz
├── trpc.ts                    # Contexto e transformer SuperJSON
└── routers/task.ts            # Procedures CRUD e paginação
```

### Decisões técnicas

- A página inicial é um Server Component com
  `export const dynamic = "force-dynamic"` e chama o router diretamente com
  `createServerCaller`, então a primeira página de tarefas já é renderizada no
  HTML do servidor.
- O array de tarefas fica em `globalThis` para que o route handler e os Server
  Components compartilhem a mesma referência durante hot reload.
- `task.list` ordena por `dataCriacao` decrescente e usa o id do último item
  como cursor. A primeira página vem do SSR; as seguintes usam
  `useInfiniteQuery` e `IntersectionObserver`.
- As datas permanecem como `Date` através do transformer SuperJSON.
- Store, schemas e procedures são separados para manter as responsabilidades
  explícitas sem adicionar uma camada de persistência desnecessária.

## API tRPC

| Procedure | Tipo | Descrição |
|---|---|---|
| `task.list` | query | Lista tarefas com `limit` e `cursor` |
| `task.get` | query | Retorna uma tarefa por id |
| `task.create` | mutation | Cria uma tarefa |
| `task.update` | mutation | Atualiza uma tarefa existente |
| `task.delete` | mutation | Remove uma tarefa existente |

O endpoint HTTP está disponível em `/api/trpc`. No servidor, os procedimentos
são chamados diretamente via `createServerCaller`, sem uma requisição HTTP
adicional no SSR.

## Limitações conhecidas

- O armazenamento é somente em memória: reiniciar o processo ou remover o
  container apaga as tarefas.
- Em ambientes serverless, como Vercel, cada instância pode ter sua própria
  memória. Por isso, os dados não são compartilhados entre instâncias e esta
  solução não substitui um banco de dados distribuído.
- Não há autenticação, autorização ou persistência, pois esses itens não fazem
  parte do escopo atual.

## Segurança e configuração

Não há tokens, senhas ou chaves de API no projeto. Arquivos `.env*`, credenciais
e artefatos de build estão no `.gitignore`. Não é necessário `.env.example`,
pois a aplicação não possui variáveis de ambiente obrigatórias.

## Repositório

<https://github.com/Rychardsson/desafio-tecnico-artefact-web>

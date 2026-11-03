import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
};

/**
 * Lista em memória, sem banco. Fica em globalThis para sobreviver ao
 * hot reload e para o route handler e os Server Components enxergarem
 * a mesma instância dentro do processo Node.
 */
const globalForTasks = globalThis as unknown as {
  __artefactTaskStore?: Task[];
};

const tasks: Task[] = globalForTasks.__artefactTaskStore ?? [];
globalForTasks.__artefactTaskStore = tasks;

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

const tituloSchema = z
  .string()
  .trim()
  .min(1, "O título é obrigatório.");

const descricaoSchema = z
  .string()
  .trim()
  .max(5000, "A descrição deve ter no máximo 5000 caracteres.")
  .nullish()
  .transform((value) => (value ? value : undefined));

const idSchema = z.uuid("Identificador inválido.");

function findTaskIndex(id: string) {
  return tasks.findIndex((task) => task.id === id);
}

function requireTask(id: string) {
  const index = findTaskIndex(id);
  if (index === -1) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Tarefa não encontrada.",
    });
  }
  return index;
}

export const taskRouter = createTRPCRouter({
  /**
   * Lista paginada por cursor (id da última tarefa da página anterior).
   * A ordem é da mais recente para a mais antiga.
   */
  list: publicProcedure
    .input(
      z
        .object({
          // O cursor é o último id recebido, permitindo continuar sem offset.
          cursor: z.string().nullish(),
          limit: z.number().int().min(1).max(MAX_PAGE_SIZE).optional(),
        }),
    )
    .query(({ input }) => {
      const limit = input.limit ?? DEFAULT_PAGE_SIZE;
      const ordered = [...tasks].reverse();

      let start = 0;
      if (input.cursor) {
        const cursorIndex = ordered.findIndex((task) => task.id === input.cursor);
        if (cursorIndex === -1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cursor inválido.",
          });
        }
        start = cursorIndex + 1;
      }

      const items = ordered.slice(start, start + limit);
      const nextCursor =
        start + items.length < ordered.length
          ? items[items.length - 1]?.id ?? null
          : null;

      return { items, nextCursor };
    }),

  create: publicProcedure
    .input(
      z.object({
        titulo: tituloSchema,
        descricao: descricaoSchema,
      }),
    )
    .mutation(({ input }) => {
      const task: Task = {
        id: crypto.randomUUID(),
        titulo: input.titulo,
        dataCriacao: new Date(),
      };

      if (input.descricao) {
        task.descricao = input.descricao;
      }

      tasks.push(task);
      return task;
    }),

  /** Substitui título e descrição. Descrição vazia ou ausente remove o campo. */
  update: publicProcedure
    .input(
      z.object({
        id: idSchema,
        titulo: tituloSchema,
        descricao: descricaoSchema,
      }),
    )
    .mutation(({ input }) => {
      const index = requireTask(input.id);
      const current = tasks[index];
      if (!current) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada.",
        });
      }

      const updated: Task = {
        id: current.id,
        titulo: input.titulo,
        dataCriacao: current.dataCriacao,
      };

      if (input.descricao) {
        updated.descricao = input.descricao;
      }

      tasks[index] = updated;
      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: idSchema }))
    .mutation(({ input }) => {
      const index = requireTask(input.id);
      const [removed] = tasks.splice(index, 1);
      if (!removed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada.",
        });
      }
      return removed;
    }),
});

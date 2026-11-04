import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { tasks, findTaskIndex, type Task } from "../store/task";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { idSchema, taskInputSchema } from "../schemas/task";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

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
  list: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().int().min(1).max(MAX_PAGE_SIZE).optional(),
      }),
    )
    .query(({ input }) => {
      const limit = input.limit ?? DEFAULT_PAGE_SIZE;
      const ordered = [...tasks].sort(
        (first, second) =>
          second.dataCriacao.getTime() - first.dataCriacao.getTime(),
      );

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

  get: publicProcedure
    .input(z.object({ id: idSchema }))
    .query(({ input }) => {
      const index = requireTask(input.id);
      return tasks[index] as Task;
    }),

  create: publicProcedure
    .input(taskInputSchema)
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

  update: publicProcedure
    .input(z.object({ id: idSchema, ...taskInputSchema.shape }))
    .mutation(({ input }) => {
      const index = requireTask(input.id);
      const current = tasks[index] as Task;
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

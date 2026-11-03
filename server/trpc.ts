import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * Contexto disponível em toda procedure.
 * Não há autenticação neste desafio; o objeto existe para o handler HTTP
 * e o caller de servidor compartilharem a mesma assinatura.
 */
export type TRPCContext = {
  headers: Headers;
};

export const createTRPCContext = async (opts: {
  headers: Headers;
}): Promise<TRPCContext> => {
  return { headers: opts.headers };
};

const t = initTRPC.context<TRPCContext>().create({
  // Superjson preserva Date (dataCriacao) entre servidor e cliente.
  // O JSON puro converteria Date em string e a tipagem mentiria em runtime.
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

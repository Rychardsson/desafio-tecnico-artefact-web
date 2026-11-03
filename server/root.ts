import { createCallerFactory, createTRPCRouter } from "./trpc";
import { taskRouter } from "./routers/task";

export const appRouter = createTRPCRouter({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;

/** Caller usado por Server Components, sem passar pela rede. */
export const createCaller = createCallerFactory(appRouter);

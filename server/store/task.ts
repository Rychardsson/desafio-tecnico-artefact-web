export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
};

const globalForTasks = globalThis as unknown as {
  __artefactTaskStore?: Task[];
};

// globalThis mantém a mesma lista entre route handlers e Server Components no hot reload.
export const tasks = globalForTasks.__artefactTaskStore ?? [];
globalForTasks.__artefactTaskStore = tasks;

export function findTaskIndex(id: string) {
  return tasks.findIndex((task) => task.id === id);
}

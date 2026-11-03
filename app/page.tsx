import Link from "next/link";
import { TaskList } from "@/components/TaskList";
import { createServerCaller } from "@/lib/trpc/server";

export const instant = false;

export default async function Home() {
  const caller = await createServerCaller();
  const { items } = await caller.task.list({ limit: 50 });

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Artefact</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Minhas tarefas</h1>
          </div>
          <Link href="/tasks/new" className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
            Nova tarefa
          </Link>
        </header>
        <TaskList tasks={items} />
      </div>
    </main>
  );
}

import Link from "next/link";
import { TaskList } from "@/components/TaskList";
import { createServerCaller } from "@/lib/trpc/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const caller = await createServerCaller();
  const initialPage = await caller.task.list({ limit: 10 });

  return (
    <main className="min-h-screen bg-zinc-50 bg-[radial-gradient(circle_at_top,_#eff6ff,_transparent_42%),#fafafa] px-4 py-8 text-zinc-950 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">Minhas tarefas</h1>
            <p className="mt-2 text-sm text-zinc-500 sm:text-base">Organize o que precisa ser feito, um passo de cada vez.</p>
          </div>
          <Link href="/tasks/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100">
            <span className="text-lg leading-none" aria-hidden="true">+</span>
            Nova tarefa
          </Link>
        </header>
        <TaskList initialPage={initialPage} />
      </div>
    </main>
  );
}

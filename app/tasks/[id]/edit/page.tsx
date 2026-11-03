import Link from "next/link";
import { TaskForm } from "@/components/TaskForm";
import { createServerCaller } from "@/lib/trpc/server";

export const instant = false;

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caller = await createServerCaller();
  const { items } = await caller.task.list({ limit: 50 });
  const task = items.find((item) => item.id === id);

  if (!task) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Tarefa não encontrada</h1>
          <p className="mt-2 text-zinc-600">A tarefa pode ter sido excluída ou não existe mais.</p>
          <Link href="/" className="mt-6 inline-block font-medium text-blue-600 hover:underline">
            Voltar para tarefas
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
          ← Voltar para tarefas
        </Link>
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-6 text-2xl font-bold">Editar tarefa</h1>
          <TaskForm task={task} />
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { TaskForm } from "@/components/TaskForm";
import { createServerCaller } from "@/lib/trpc/server";

export const dynamic = "force-dynamic";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caller = await createServerCaller();
  let task;
  try {
    task = await caller.task.get({ id });
  } catch (error) {
    if (error instanceof Error && error.message === "Tarefa não encontrada.") {
      task = undefined;
    } else {
      throw error;
    }
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-zinc-50 bg-[radial-gradient(circle_at_top,_#eff6ff,_transparent_42%),#fafafa] px-4 py-8 text-zinc-950 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
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
    <main className="min-h-screen bg-zinc-50 bg-[radial-gradient(circle_at_top,_#eff6ff,_transparent_42%),#fafafa] px-4 py-8 text-zinc-950 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-zinc-500 transition hover:text-blue-600">
          ← Voltar para tarefas
        </Link>
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:mt-8 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Editar tarefa</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Ajuste os detalhes da tarefa</h1>
          <p className="mb-8 mt-2 text-sm text-zinc-500">Atualize as informações e mantenha tudo em dia.</p>
          <TaskForm task={task} />
        </div>
      </div>
    </main>
  );
}

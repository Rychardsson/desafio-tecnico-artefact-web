"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import type { Task } from "@/server/routers/task";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const deleteTask = trpc.task.delete.useMutation({
    onMutate: ({ id }) => {
      setDeletingId(id);
      setError("");
    },
    onSuccess: async () => {
      await utils.task.list.invalidate();
      setDeletingId(null);
      router.refresh();
    },
    onError: (mutationError) => {
      setError(mutationError.message);
      setDeletingId(null);
    },
  });

  async function handleDelete(id: string) {
    if (!window.confirm("Deseja excluir esta tarefa?")) {
      return;
    }
    deleteTask.mutate({ id });
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
        <p className="text-zinc-600">Nenhuma tarefa cadastrada.</p>
        <Link href="/tasks/new" className="mt-4 inline-block font-medium text-blue-600 hover:underline">
          Criar a primeira tarefa
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Não foi possível excluir a tarefa: {error}
        </p>
      ) : null}
      {tasks.map((task) => (
        <article key={task.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="break-words text-lg font-semibold text-zinc-900">{task.titulo}</h2>
              {task.descricao ? <p className="mt-2 whitespace-pre-wrap text-zinc-600">{task.descricao}</p> : null}
              <time dateTime={task.dataCriacao.toISOString()} className="mt-4 block text-xs text-zinc-500">
                Criada em {task.dataCriacao.toLocaleString("pt-BR")}
              </time>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href={`/tasks/${task.id}/edit`} className="rounded-md px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(task.id)}
                disabled={deletingId === task.id}
                className="rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === task.id ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

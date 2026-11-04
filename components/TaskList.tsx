"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import type { Task } from "@/server/store/task";

type TaskPage = {
  items: Task[];
  nextCursor: string | null;
};

export function TaskList({ initialPage }: { initialPage: TaskPage }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const tasksQuery = trpc.task.list.useInfiniteQuery(
    { limit: 10 },
    {
      // Reaproveita a página renderizada no servidor e busca só as próximas.
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialData: {
        pages: [initialPage],
        pageParams: [undefined],
      },
      staleTime: 30_000,
    },
  );
  const tasks = tasksQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const hasNextPage = tasksQuery.hasNextPage;

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasNextPage) {
      return;
    }

    // A margem inicia a busca antes de o usuário alcançar o fim da lista.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !tasksQuery.isFetchingNextPage) {
          void tasksQuery.fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, tasksQuery]);

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
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-14">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600" aria-hidden="true">
          ✓
        </div>
        <h2 className="mt-5 text-lg font-semibold text-zinc-900">Tudo pronto para começar?</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">Crie sua primeira tarefa e mantenha seu dia organizado.</p>
        <Link href="/tasks/new" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-200">
          <span className="text-lg leading-none" aria-hidden="true">+</span>
          Criar a primeira tarefa
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          Não foi possível excluir a tarefa: {error}
        </p>
      ) : null}
      {tasks.map((task) => (
        <article key={task.id} className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Em aberto
              </div>
              <h2 className="break-words text-lg font-semibold text-zinc-900">{task.titulo}</h2>
              {task.descricao ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-600">{task.descricao}</p> : null}
              <time dateTime={task.dataCriacao.toISOString()} className="mt-4 block text-xs text-zinc-400">
                Criada em {task.dataCriacao.toLocaleString("pt-BR")}
              </time>
            </div>
            <div className="flex shrink-0 gap-2 border-t border-zinc-100 pt-4 sm:border-0 sm:pt-0">
              <Link href={`/tasks/${task.id}/edit`} className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100">
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(task.id)}
                disabled={deletingId === task.id}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === task.id ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </article>
      ))}
      <div ref={loadMoreRef} aria-hidden="true" className="h-1" />
      {tasksQuery.isFetchingNextPage ? (
        <p className="py-4 text-center text-sm text-zinc-500">Carregando mais tarefas...</p>
      ) : null}
      {tasksQuery.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Não foi possível carregar mais tarefas: {tasksQuery.error.message}
        </p>
      ) : null}
    </div>
  );
}

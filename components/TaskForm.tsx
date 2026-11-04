"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import type { Task } from "@/server/store/task";

type TaskFormProps = {
  task?: Task;
};

export function TaskForm({ task }: TaskFormProps) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(task?.titulo ?? "");
  const [descricao, setDescricao] = useState(task?.descricao ?? "");
  const [validationError, setValidationError] = useState("");

  const createTask = trpc.task.create.useMutation({
    onSuccess: () => router.push("/"),
  });
  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => router.push("/"),
  });
  const mutation = task ? updateTask : createTask;
  const isPending = createTask.isPending || updateTask.isPending;
  const error = validationError || mutation.error?.message;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = titulo.trim();

    if (!trimmedTitle) {
      setValidationError("Informe um título para a tarefa.");
      return;
    }

    setValidationError("");
    if (task) {
      updateTask.mutate({
        id: task.id,
        titulo: trimmedTitle,
        descricao,
      });
    } else {
      createTask.mutate({ titulo: trimmedTitle, descricao });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="titulo" className="mb-2 block text-sm font-semibold text-zinc-800">
          Título <span aria-hidden="true">*</span>
        </label>
        <input
          id="titulo"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          disabled={isPending}
          required
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-zinc-100"
          placeholder="Ex.: Preparar apresentação"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="mb-2 block text-sm font-semibold text-zinc-800">
          Descrição <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          disabled={isPending}
          rows={5}
          className="w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-zinc-100"
          placeholder="Adicione detalhes sobre a tarefa"
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Salvando..." : task ? "Salvar alterações" : "Criar tarefa"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          disabled={isPending}
          className="rounded-xl px-5 py-3 font-semibold text-zinc-600 transition hover:bg-zinc-100 focus:outline-none focus:ring-4 focus:ring-zinc-200 disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

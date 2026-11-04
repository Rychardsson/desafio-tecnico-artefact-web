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
  const [fieldErrors, setFieldErrors] = useState<{
    titulo?: string;
    descricao?: string;
  }>({});

  const createTask = trpc.task.create.useMutation({
    onSuccess: () => router.push("/?feedback=Tarefa%20criada%20com%20sucesso."),
  });
  const updateTask = trpc.task.update.useMutation({
    onSuccess: () =>
      router.push("/?feedback=Tarefa%20atualizada%20com%20sucesso."),
  });
  const mutation = task ? updateTask : createTask;
  const isPending = createTask.isPending || updateTask.isPending;
  const error = validationError || mutation.error?.message;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = titulo.trim();
    const nextFieldErrors: typeof fieldErrors = {};

    if (!trimmedTitle) {
      nextFieldErrors.titulo = "Informe um título para a tarefa.";
    } else if (trimmedTitle.length > 120) {
      nextFieldErrors.titulo = "O título deve ter no máximo 120 caracteres.";
    }
    if (descricao.trim().length > 500) {
      nextFieldErrors.descricao = "A descrição deve ter no máximo 500 caracteres.";
    }
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) {
      setValidationError("");
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
          maxLength={120}
          aria-invalid={Boolean(fieldErrors.titulo)}
          aria-describedby={fieldErrors.titulo ? "titulo-error" : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-zinc-100 ${fieldErrors.titulo ? "border-red-400" : "border-zinc-300"}`}
          placeholder="Ex.: Preparar apresentação"
        />
        {fieldErrors.titulo ? (
          <p id="titulo-error" className="mt-2 text-sm text-red-600">
            {fieldErrors.titulo}
          </p>
        ) : null}
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
          maxLength={500}
          aria-invalid={Boolean(fieldErrors.descricao)}
          aria-describedby={fieldErrors.descricao ? "descricao-error" : undefined}
          className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-zinc-100 ${fieldErrors.descricao ? "border-red-400" : "border-zinc-300"}`}
          placeholder="Adicione detalhes sobre a tarefa"
        />
        <div className="mt-2 flex justify-between text-xs text-zinc-400">
          {fieldErrors.descricao ? (
            <p id="descricao-error" className="text-red-600">
              {fieldErrors.descricao}
            </p>
          ) : (
            <span />
          )}
          <span>{descricao.length}/500</span>
        </div>
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

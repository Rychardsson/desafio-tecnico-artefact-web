import Link from "next/link";
import { TaskForm } from "@/components/TaskForm";

export default function NewTaskPage() {
  return (
    <main className="min-h-screen bg-zinc-50 bg-[radial-gradient(circle_at_top,_#eff6ff,_transparent_42%),#fafafa] px-4 py-8 text-zinc-950 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-zinc-500 transition hover:text-blue-600">
          ← Voltar para tarefas
        </Link>
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:mt-8 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Nova tarefa</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">O que precisa ser feito?</h1>
          <p className="mb-8 mt-2 text-sm text-zinc-500">Adicione os detalhes para não perder o foco.</p>
          <TaskForm />
        </div>
      </div>
    </main>
  );
}

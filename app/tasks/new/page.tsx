import Link from "next/link";
import { TaskForm } from "@/components/TaskForm";

export default function NewTaskPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
          ← Voltar para tarefas
        </Link>
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-6 text-2xl font-bold">Nova tarefa</h1>
          <TaskForm />
        </div>
      </div>
    </main>
  );
}

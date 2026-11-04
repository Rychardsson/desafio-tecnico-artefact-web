import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 text-center text-zinc-950">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
          Erro 404
        </p>
        <h1 className="mt-3 text-3xl font-bold">Página não encontrada</h1>
        <p className="mt-3 text-zinc-600">
          O endereço acessado não existe ou foi removido.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white hover:bg-zinc-700"
        >
          Voltar para tarefas
        </Link>
      </div>
    </main>
  );
}

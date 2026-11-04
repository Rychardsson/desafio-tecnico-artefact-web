"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 text-center text-zinc-950">
      <div className="max-w-md">
        <p className="text-sm font-bold uppercase tracking-widest text-red-600">
          Algo deu errado
        </p>
        <h1 className="mt-3 text-3xl font-bold">
          Não foi possível carregar a página
        </h1>
        <p className="mt-3 text-zinc-600">
          Tente novamente ou volte para a lista de tarefas.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="rounded-xl px-5 py-3 font-semibold text-zinc-600 hover:bg-zinc-200"
          >
            Início
          </Link>
        </div>
      </div>
    </main>
  );
}

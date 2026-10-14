import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-4 text-gray-700">
        <Link href="/" className="underline" style={{ color: "var(--color-az2)" }}>Voltar para a página inicial</Link>
      </p>
    </main>
  );
}

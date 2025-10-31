export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-center text-white">
      <h1 className="text-5xl font-bold tracking-tight">Sayfa bulunamadı</h1>
      <p className="max-w-lg text-lg text-slate-300">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Lütfen ana sayfaya
        dönerek NeonCheck AI panosunu tekrar ziyaret edin.
      </p>
      <a
        href="/"
        className="rounded-full bg-fuchsia-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:bg-fuchsia-400"
      >
        Ana sayfaya dön
      </a>
    </main>
  );
}

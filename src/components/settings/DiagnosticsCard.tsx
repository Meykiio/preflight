export const DiagnosticsCard = (): JSX.Element => {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6">
      <div className="space-y-5">
        <div className="rounded-full bg-surface px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          System v0.1.0-alpha
        </div>
      </div>
    </section>
  );
};

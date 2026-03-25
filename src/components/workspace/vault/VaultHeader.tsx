interface VaultHeaderProps {
  filterOptions: Array<{ label: string; value: string }>;
  filterValue: string;
  onChangeFilter: (value: string) => void;
  onChangeSearch: (value: string) => void;
  projectName?: string;
  searchValue: string;
}

export const VaultHeader = ({
  filterOptions,
  filterValue,
  onChangeFilter,
  onChangeSearch,
  projectName,
  searchValue
}: VaultHeaderProps): JSX.Element => {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-headline text-[28px] font-bold tracking-tight text-on-surface">
            Project Vault
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Store and manage technical assets, context files, and project exports.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2 rounded-xl border border-outline-variant/10 bg-surface px-2 py-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChangeFilter(option.value)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  filterValue === option.value
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="flex min-w-[240px] items-center gap-3 rounded-xl border border-outline-variant/10 bg-surface px-4 py-3 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-base">search</span>
            <input
              value={searchValue}
              onChange={(event) => onChangeSearch(event.target.value)}
              placeholder="Scan the vault..."
              className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
            />
          </label>
        </div>
      </div>
    </section>
  );
};

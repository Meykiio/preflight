interface BriefNotesSectionProps {
  isOpen: boolean;
  notes: string;
  onChangeNotes: (value: string) => void;
  onToggle: () => void;
}

export const BriefNotesSection = ({
  isOpen,
  notes,
  onChangeNotes,
  onToggle
}: BriefNotesSectionProps): JSX.Element => {
  return (
    <section className="mt-6 rounded-xl bg-surface-container p-5">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between text-left">
        <div>
          <p className="font-headline text-xl font-semibold text-on-surface">Notes</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Capture context, inspiration, and constraints.
          </p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {isOpen ? (
        <textarea
          rows={5}
          value={notes}
          onChange={(event) => onChangeNotes(event.target.value)}
          placeholder="Add anything the future build prompts should know."
          className="mt-4 w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
        />
      ) : null}
    </section>
  );
};

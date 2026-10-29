export function MobiusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M10 24c0-8.8 6.2-14 14.2-14 6.4 0 10.4 3.4 12.8 7.4M38 24c0 8.8-6.2 14-14.2 14-6.4 0-10.4-3.4-12.8-7.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M37 17.4c-3.2 4.6-8.2 7.2-13 7.2-4.2 0-7.6-1.8-9.8-4.6M11 30.6c3.2-4.6 8.2-7.2 13-7.2 4.2 0 7.6 1.8 9.8 4.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

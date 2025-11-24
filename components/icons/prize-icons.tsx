/**
 * Custom icons for prize section
 */

interface IconProps {
  className?: string;
}

export function MoneyIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M16 4H2v12h4v4h16V8h-4V4h-2zm0 2v2H6v6H4V6h12zm-8 4h12v8H8v-8zm8 2h-4v4h4v-4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlaneIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      id="plane-departure"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <rect x="1" y="18" width="22" height="2" fill="currentColor" />
      <path
        d="m19,4v1h-2v1h-2v1h-2v-1h-2v-1h-2v-1h-2v-1h-1v1h-1v1h-1v1h1v1h1v1h1v1h1v1h-1v1h-2v-1h-1v-1H1v3h1v1h1v1h1v1h6v-1h2v-1h2v-1h2v-1h2v-1h2v-1h2v-1h1v-4h-4Zm3,3h-1v1h-2v1h-2v1h-2v1h-2v1h-2v1h-2v1h-4v-1h-1v-1h-1v-1h-1v-1h1v1h1v1h4v-1h1v-3h-1v-1h-1v-1h-1v-1h2v1h2v1h2v1h4v-1h2v-1h2v-1h2v2Z"
        fill="currentColor"
      />
    </svg>
  );
}

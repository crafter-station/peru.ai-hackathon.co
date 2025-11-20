import type { LucideProps } from "lucide-react";

export function IntroItem({
  icon: Icon,
  content,
  href,
}: {
  icon: React.ComponentType<LucideProps>;
  content: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-center gap-4 font-mono text-sm">
      <div
        className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 border border-brand-red/20"
        aria-hidden
      >
        <Icon className="pointer-events-none size-4 text-brand-red" />
      </div>

      <p className="text-balance">
        {href ? (
          <a
            className="underline-offset-4 hover:underline"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </p>
    </div>
  );
}


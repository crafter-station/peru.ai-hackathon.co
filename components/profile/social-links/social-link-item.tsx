import { ArrowUpRightIcon } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLinkItemProps {
  url: string;
  platform: string;
  icon: React.ComponentType<LucideProps>;
}

export function SocialLinkItem({ url, platform, icon: Icon }: SocialLinkItemProps) {
  return (
    <a
      className={cn(
        "group/link flex cursor-pointer items-center gap-4 rounded-2xl p-4 pr-2 transition-colors select-none",
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after",
        "hover:bg-muted/50"
      )}
      href={url}
      target="_blank"
      rel="noopener"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 border border-brand-red/20">
        <Icon className="size-5 text-brand-red" />
      </div>

      <div className="flex-1">
        <h3 className="flex items-center font-medium underline-offset-4 group-hover/link:underline text-foreground">
          {platform}
        </h3>
      </div>

      <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover/link:text-brand-red transition-colors" />
    </a>
  );
}


import Image from "next/image";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { cn } from "@/lib/utils";
import { VerifiedIcon } from "./verified-icon";

interface ProfileHeaderProps {
  displayName: string;
  avatar?: string | null;
  bio?: string | null;
}

export function ProfileHeader({
  displayName,
  avatar,
  bio,
}: ProfileHeaderProps) {
  return (
    <div className="screen-line-after flex border-x border-edge border-l-[1.5px] border-r-[1.5px]">
      <div className="shrink-0 border-r border-edge border-r-[1.5px] relative after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-transparent after:via-edge/60 after:to-transparent">
        <div className="mx-[2px] my-[3px]">
          {avatar ? (
            <Image
              className="size-32 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-40"
              alt={`${displayName}'s avatar`}
              src={avatar}
              width={160}
              height={160}
              fetchPriority="high"
            />
          ) : (
            <div className="size-32 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-40 bg-muted flex items-center justify-center">
              <span className="text-4xl text-muted-foreground">?</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div
          className={cn(
            "flex grow items-end pb-1 pl-4",
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/56",
            "relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-edge/10 before:to-transparent"
          )}
        />

        <div className="border-t border-edge border-t-[1.5px] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-edge/60 before:to-transparent">
          <h1 className="flex items-center pl-4 text-3xl font-black uppercase tracking-tight relative z-10">
            {displayName}
            &nbsp;
            <SimpleTooltip content="Verified">
              <VerifiedIcon className="size-[0.6em] translate-y-px text-brand-red select-none" />
            </SimpleTooltip>
          </h1>

          {bio && (
            <div className="border-t border-edge border-t-[1.5px] py-1 pl-4 relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-edge/40 before:to-transparent">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="font-mono text-sm text-balance text-muted-foreground whitespace-pre-wrap">
                  {bio}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


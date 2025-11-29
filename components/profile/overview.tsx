import { GlobeIcon, Building2Icon, HashIcon, GiftIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { Panel, PanelContent } from "./panel";
import { IntroItem } from "./overview/intro-item";
import { Button } from "@/components/ui/button";

interface OverviewProps {
  organization?: string | null;
  websiteUrl?: string | null;
  participantNumber?: number | null;
  cursorCode?: string | null;
  isLoggedIn?: boolean;
  clerkUserId?: string;
  profileNumber?: number | null;
}

export function Overview({
  organization,
  websiteUrl,
  participantNumber,
  cursorCode,
  isLoggedIn = false,
  clerkUserId,
  profileNumber,
}: OverviewProps) {
  const showLoginHint = !isLoggedIn && clerkUserId && !cursorCode;
  const returnUrl = profileNumber ? `/p/${profileNumber}` : "/";

  return (
    <Panel>
      <h2 className="sr-only">Overview</h2>

      <PanelContent className="space-y-2">
        {participantNumber && (
          <IntroItem
            icon={HashIcon}
            content={`Participant #${String(participantNumber).padStart(4, "0")}`}
          />
        )}

        {organization && (
          <IntroItem icon={Building2Icon} content={organization} />
        )}

        {cursorCode && (
          <IntroItem
            icon={GiftIcon}
            content={`Cursor Code: ${cursorCode}`}
            href={`https://cursor.com/referral?code=${cursorCode}`}
          />
        )}

        {showLoginHint && (
          <div className="flex items-center gap-4 font-mono text-sm">
            <div
              className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 border border-brand-red/20 opacity-60"
              aria-hidden
            >
              <GiftIcon className="pointer-events-none size-4 text-brand-red opacity-50" />
            </div>
            <div className="flex-1 flex items-center gap-2 flex-wrap">
              <p className="text-muted-foreground text-xs">
                Inicia sesión para ver tu código de Cursor
              </p>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-auto py-0.5 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <Link href={`/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`}>
                  <LogInIcon className="size-3" />
                  Iniciar sesión
                </Link>
              </Button>
            </div>
          </div>
        )}

        {websiteUrl && (
          <IntroItem
            icon={GlobeIcon}
            content={websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            href={websiteUrl}
          />
        )}
      </PanelContent>
    </Panel>
  );
}


import { GlobeIcon, Building2Icon, HashIcon } from "lucide-react";
import { Panel, PanelContent } from "./panel";
import { IntroItem } from "./overview/intro-item";

interface OverviewProps {
  organization?: string | null;
  websiteUrl?: string | null;
  participantNumber?: number | null;
}

export function Overview({
  organization,
  websiteUrl,
  participantNumber,
}: OverviewProps) {
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


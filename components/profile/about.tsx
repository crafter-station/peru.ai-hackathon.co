import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

interface AboutProps {
  bio?: string | null;
}

export function About({ bio }: AboutProps) {
  if (!bio) return null;

  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{bio}</p>
        </div>
      </PanelContent>
    </Panel>
  );
}


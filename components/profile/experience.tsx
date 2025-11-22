import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

export function Experience() {
  return (
    <Panel id="experience">
      <PanelHeader>
        <PanelTitle>Experience</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      </PanelContent>
    </Panel>
  );
}


import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

interface TechStackProps {
  techStack?: string[] | null;
}

export function TechStack({ techStack }: TechStackProps) {
  if (!techStack || techStack.length === 0) return null;

  return (
    <Panel id="stack">
      <PanelHeader>
        <PanelTitle>Stack</PanelTitle>
      </PanelHeader>

      <PanelContent className="dither-bg">
        <ul className="flex flex-wrap gap-4 select-none">
          {techStack.map((tech, index) => (
            <li key={index} className="flex">
              <span className="px-3 py-1 rounded-lg bg-muted font-mono text-sm text-foreground">
                {tech}
              </span>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  );
}


import React from "react";
import { Linkedin, Instagram, Twitter, Github, Globe } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { Panel } from "./panel";
import { SocialLinkItem } from "./social-links/social-link-item";

interface SocialLink {
  url: string;
  platform: string;
  icon: React.ComponentType<LucideProps>;
}

interface SocialLinksProps {
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
}

export function SocialLinks({
  linkedinUrl,
  instagramUrl,
  twitterUrl,
  githubUrl,
  websiteUrl,
}: SocialLinksProps) {
  const links: SocialLink[] = [];

  if (linkedinUrl) {
    links.push({ url: linkedinUrl, platform: "LinkedIn", icon: Linkedin });
  }
  if (instagramUrl) {
    links.push({ url: instagramUrl, platform: "Instagram", icon: Instagram });
  }
  if (twitterUrl) {
    links.push({ url: twitterUrl, platform: "X/Twitter", icon: Twitter });
  }
  if (githubUrl) {
    links.push({ url: githubUrl, platform: "GitHub", icon: Github });
  }
  if (websiteUrl) {
    links.push({ url: websiteUrl, platform: "Website", icon: Globe });
  }

  if (links.length === 0) return null;

  return (
    <Panel>
      <h2 className="sr-only">Social Links</h2>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge"></div>
          <div className="border-l border-edge"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {links.map((link, index) => (
            <SocialLinkItem key={index} {...link} />
          ))}
        </div>
      </div>
    </Panel>
  );
}


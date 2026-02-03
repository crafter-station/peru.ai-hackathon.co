# Profile UI Design System Documentation

This document provides a comprehensive guide to replicating the Profile UI design system implemented in this project. The design follows a **"Lines Design System"** - a distinctive approach using full-width horizontal lines that extend beyond the content container to create visual separation and structure.

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [CSS Foundation](#css-foundation)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Core Utility Classes](#core-utility-classes)
6. [Component Architecture](#component-architecture)
7. [Panel System](#panel-system)
8. [Profile Components](#profile-components)
9. [Implementation Examples](#implementation-examples)

---

## Design Philosophy

The Lines Design System is built on these principles:

1. **Full-width horizontal lines**: Lines extend 100vw (viewport width) beyond the content, creating a sense of infinite horizontal space
2. **Gradient-enhanced borders**: Borders use subtle gradients that fade from transparent at edges to a more visible center
3. **Layered depth**: Multiple pseudo-elements (`::before`, `::after`) create depth through gradients and patterns
4. **Contained content**: While lines extend full-width, content remains constrained to a max-width container
5. **Consistent spacing**: Panels stack vertically with separators between them

---

## CSS Foundation

### Core Variables

```css
:root {
  --radius: 0.625rem;
  --brand-red: #B91F2E;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --border: oklch(0.922 0 0);
  --edge: color-mix(in oklab, var(--border) 64%, var(--background));
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --edge: color-mix(in oklab, var(--border) 64%, var(--background));
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
}
```

The `--edge` color is crucial - it's a blended color between the border and background, creating subtle, non-intrusive lines.

---

## Color System

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|------------|-----------|
| `--background` | Page background | White | Near-black |
| `--foreground` | Primary text | Near-black | Near-white |
| `--border` | Standard borders | Light gray | 10% white |
| `--edge` | Line design borders | Mixed (subtle) | Mixed (subtle) |
| `--brand-red` | Accent color | `#B91F2E` | `#B91F2E` |
| `--muted` | Muted backgrounds | Very light gray | Dark gray |
| `--muted-foreground` | Secondary text | Medium gray | Light gray |

---

## Typography

### Font Families

```css
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
--font-adelle-mono: var(--font-adelle-mono, inherit);
```

### Usage Patterns

- **Panel Titles**: `font-black uppercase tracking-tight text-3xl`
- **Mono Text**: `font-mono text-sm`
- **Muted Labels**: `font-mono text-xs text-muted-foreground uppercase tracking-wider`

---

## Core Utility Classes

### The Screen Line System

These are the foundational classes for the Lines Design System:

```css
.screen-line-before {
  @apply relative before:absolute before:top-0 before:-left-[100vw] before:-z-10 before:h-px before:w-[200vw] before:bg-edge;
}

.screen-line-after {
  @apply relative after:absolute after:bottom-0 after:-left-[100vw] after:-z-10 after:h-px after:w-[200vw] after:bg-edge;
}
```

**How they work:**

1. `before:absolute` / `after:absolute` - Position pseudo-elements absolutely
2. `before:-left-[100vw]` - Start 100vw to the left of the element
3. `before:w-[200vw]` - Make the line 200vw wide (100vw left + container + 100vw right)
4. `before:h-px` - 1 pixel height
5. `before:-z-10` - Place behind content
6. `before:bg-edge` - Use the edge color for subtle visibility

### Dither Background

```css
.dither-bg {
  background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
  background-size: 6px 6px;
  background-blend-mode: normal;
}

.dark .dither-bg {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
}
```

Creates a subtle dotted pattern for texture.

---

## Component Architecture

### File Structure

```
components/profile/
├── panel.tsx              # Base panel component
├── separator.tsx          # Visual separator between panels
├── profile-cover.tsx      # Cover/banner section
├── profile-header.tsx     # Avatar, name, bio section
├── overview.tsx           # Quick info section
├── overview/
│   └── intro-item.tsx     # Single info row
├── social-links.tsx       # Social media links grid
├── social-links/
│   └── social-link-item.tsx  # Single social link
├── achievements.tsx       # Badge/achievements section
├── tech-stack.tsx         # Technology tags
├── about.tsx              # Bio/description section
├── verified-icon.tsx      # Verification badge SVG
├── flip-sentences.tsx     # Animated text rotation
├── collapsible-list.tsx   # Expandable list
├── profile-edit-modal.tsx # Edit profile dialog
└── experience.tsx         # Experience section (placeholder)
```

---

## Panel System

### Panel Component

The `Panel` is the foundational container for all profile sections.

```tsx
function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        // Full-width lines above and below
        "screen-line-before screen-line-after",
        // Side borders with specific width
        "border-x border-edge border-x-[1.5px]",
        "relative",
        // Gradient overlay on the top line
        "before:bg-gradient-to-r before:from-transparent before:via-edge/70 before:to-transparent",
        "before:shadow-[0_1px_0_0_rgba(0,0,0,0.03)]",
        // Gradient overlay on the bottom line
        "after:bg-gradient-to-r after:from-transparent after:via-edge/70 after:to-transparent",
        "after:shadow-[0_-1px_0_0_rgba(0,0,0,0.03)]",
        className
      )}
      {...props}
    />
  );
}
```

**Key features:**
- Uses both `screen-line-before` and `screen-line-after`
- Adds gradient overlays via the `before:bg-gradient-to-r` and `after:bg-gradient-to-r` classes
- Side borders use `border-x-[1.5px]` for slightly thicker vertical lines

### Panel Header

```tsx
function PanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header"
      className={cn(
        "screen-line-after px-4",
        "after:bg-gradient-to-r after:from-transparent after:via-edge/80 after:to-transparent",
        "after:shadow-[0_1px_0_0_rgba(0,0,0,0.05)]",
        className
      )}
      {...props}
    />
  );
}
```

### Panel Title

```tsx
function PanelTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h2"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "h2";

  return (
    <Comp
      data-slot="panel-title"
      className={cn("text-3xl font-black uppercase tracking-tight", className)}
      {...props}
    />
  );
}
```

### Panel Content

```tsx
function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="panel-body" className={cn("p-4", className)} {...props} />
  );
}
```

---

## Profile Components

### 1. Separator

The `Separator` component creates visual breaks between panels with a diagonal pattern.

```tsx
export function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        // Base styles
        "relative flex h-8 w-full border-x border-edge",
        // Full-width pattern background
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
        // Diagonal stripe pattern
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
        "before:bg-size-[10px_10px]",
        "before:[--pattern-foreground:var(--color-edge)]/56",
        // Vertical gradient overlay for depth
        "after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:via-edge/20 after:to-transparent",
        // Border widths
        "border-l-[1.5px] border-r-[1.5px]",
        className
      )}
    />
  );
}
```

**Key features:**
- Fixed height of `h-8` (32px)
- Diagonal stripes at 315 degrees
- Gradient overlay creates subtle shading
- Pattern extends full viewport width

### 2. Profile Cover

```tsx
export function ProfileCover() {
  return (
    <div
      className={cn(
        // Aspect ratios for different screen sizes
        "aspect-2/1 sm:aspect-3/1",
        // Borders and selection
        "border-x border-edge select-none",
        // Full-width lines
        "screen-line-before screen-line-after before:-top-px after:-bottom-px",
        // Background
        "bg-background dither-bg",
        // Centering
        "flex items-center justify-center text-foreground"
      )}
    >
      {/* Content */}
    </div>
  );
}
```

### 3. Profile Header

The header combines avatar, name, verification badge, and bio.

```tsx
export function ProfileHeader({
  displayName,
  avatar,
  bio,
  showEditButton,
  onEditClick,
}: ProfileHeaderProps) {
  return (
    <div className="screen-line-after flex border-x border-edge border-l-[1.5px] border-r-[1.5px]">
      {/* Avatar Section */}
      <div className="shrink-0 border-r border-edge border-r-[1.5px] relative after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-transparent after:via-edge/60 after:to-transparent">
        <div className="mx-[2px] my-[3px]">
          {/* Avatar Image */}
          <div className="relative size-32 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-40 overflow-hidden">
            <Image ... />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col">
        {/* Pattern background area */}
        <div
          className={cn(
            "flex grow items-end pb-1 pl-4",
            // Diagonal pattern
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
            "bg-size-[10px_10px]",
            "[--pattern-foreground:var(--color-edge)]/56",
            // Gradient overlay
            "relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-edge/10 before:to-transparent"
          )}
        />

        {/* Name section */}
        <div className="border-t border-edge border-t-[1.5px] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-edge/60 before:to-transparent">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center pl-4 text-3xl font-black uppercase tracking-tight relative z-10">
              {displayName}
              <VerifiedIcon className="size-[0.6em] translate-y-px text-brand-red select-none" />
            </h1>
          </div>

          {/* Bio section */}
          {bio && (
            <div className="border-t border-edge border-t-[1.5px] py-1 pl-4 relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-edge/40 before:to-transparent">
              <p className="font-mono text-sm text-balance text-muted-foreground whitespace-pre-wrap">
                {bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Key patterns in Profile Header:**

1. **Vertical divider with gradient**:
```css
after:absolute after:inset-y-0 after:right-0 after:w-px 
after:bg-gradient-to-b after:from-transparent after:via-edge/60 after:to-transparent
```

2. **Horizontal divider with gradient**:
```css
before:absolute before:top-0 before:left-0 before:right-0 before:h-px 
before:bg-gradient-to-r before:from-transparent before:via-edge/60 before:to-transparent
```

3. **Ring offset for avatar**:
```css
ring-1 ring-border ring-offset-2 ring-offset-background
```

### 4. Overview Component

Displays quick profile information with icon+text rows.

```tsx
export function Overview({
  organization,
  websiteUrl,
  participantNumber,
  cursorCode,
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
        {/* More items... */}
      </PanelContent>
    </Panel>
  );
}
```

### 5. IntroItem Component

A reusable row with icon and text.

```tsx
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
      {/* Icon container */}
      <div
        className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 border border-brand-red/20"
        aria-hidden
      >
        <Icon className="pointer-events-none size-4 text-brand-red" />
      </div>

      {/* Content */}
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
```

**Icon container pattern:**
```css
size-6 rounded-lg bg-brand-red/10 border border-brand-red/20
```

### 6. Social Links Grid

Uses CSS Grid with visual dividers.

```tsx
export function SocialLinks({ ... }: SocialLinksProps) {
  return (
    <Panel>
      <h2 className="sr-only">Social Links</h2>

      <div className="relative">
        {/* Background grid dividers */}
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge"></div>
          <div className="border-l border-edge"></div>
        </div>

        {/* Actual grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {links.map((link, index) => (
            <SocialLinkItem key={index} {...link} />
          ))}
        </div>
      </div>
    </Panel>
  );
}
```

### 7. Social Link Item

```tsx
export function SocialLinkItem({ url, platform, icon: Icon }: SocialLinkItemProps) {
  return (
    <a
      className={cn(
        "group/link flex cursor-pointer items-center gap-4 rounded-2xl p-4 pr-2 transition-colors select-none",
        // Responsive screen lines
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after",
        "hover:bg-muted/50"
      )}
      href={url}
      target="_blank"
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
```

**Notable pattern**: `sm:nth-[2n+1]:screen-line-before` - Only apply screen lines to odd items on desktop to avoid double lines.

### 8. Achievements Panel

```tsx
export function Achievements({ badgeBlobUrl, participantNumber }: AchievementsProps) {
  return (
    <Panel id="achievements">
      <PanelHeader>
        <PanelTitle className="flex items-center gap-3">
          <TrophyIcon className="size-6 text-brand-red" />
          Achievements
        </PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-6">
        {/* Content with share section */}
        <div className="w-full space-y-3 pt-2 border-t border-edge border-t-[1.5px] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-edge/50 before:to-transparent">
          {/* Share buttons */}
        </div>
      </PanelContent>
    </Panel>
  );
}
```

### 9. Tech Stack

Uses tags with dither background.

```tsx
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
```

---

## Implementation Examples

### Complete Page Structure

```tsx
export default function ProfilePage() {
  return (
    <div className="mx-auto md:max-w-3xl">
      <ProfileCover />
      <ProfileHeader
        displayName={profile.fullName}
        avatar={profile.avatar}
        bio={profile.bio}
      />
      <Separator />

      <Overview
        organization={profile.organization}
        participantNumber={profile.participantNumber}
      />
      <Separator />

      <SocialLinks
        linkedinUrl={profile.linkedinUrl}
        twitterUrl={profile.twitterUrl}
        githubUrl={profile.githubUrl}
      />
      <Separator />

      <Achievements badgeBlobUrl={profile.badgeBlobUrl} />
      <Separator />

      <TechStack techStack={profile.techStack} />
      <Separator />
    </div>
  );
}
```

### Creating a Custom Panel

```tsx
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

export function CustomSection({ data }) {
  return (
    <Panel id="custom">
      <PanelHeader>
        <PanelTitle className="flex items-center gap-3">
          <CustomIcon className="size-6 text-brand-red" />
          Custom Section
        </PanelTitle>
      </PanelHeader>
      <PanelContent>
        {/* Your content here */}
      </PanelContent>
    </Panel>
  );
}
```

### Adding Internal Dividers

```tsx
<div className="border-t border-edge border-t-[1.5px] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-edge/50 before:to-transparent">
  {/* Content below divider */}
</div>
```

---

## Key CSS Patterns Reference

### Full-Width Line (Horizontal)
```css
before:absolute before:top-0 before:-left-[100vw] before:-z-10 before:h-px before:w-[200vw] before:bg-edge
```

### Gradient-Enhanced Horizontal Divider
```css
border-t border-edge border-t-[1.5px] relative 
before:absolute before:top-0 before:left-0 before:right-0 before:h-px 
before:bg-gradient-to-r before:from-transparent before:via-edge/60 before:to-transparent
```

### Gradient-Enhanced Vertical Divider
```css
border-r border-edge border-r-[1.5px] relative 
after:absolute after:inset-y-0 after:right-0 after:w-px 
after:bg-gradient-to-b after:from-transparent after:via-edge/60 after:to-transparent
```

### Diagonal Pattern Background
```css
bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]
bg-size-[10px_10px]
[--pattern-foreground:var(--color-edge)]/56
```

### Icon Container (Brand Accent)
```css
flex size-6 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 border border-brand-red/20
```

### Large Icon Container
```css
flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 border border-brand-red/20
```

---

## Dependencies

- **Tailwind CSS v4** - Utility-first CSS framework
- **@radix-ui/react-slot** - Polymorphic component support
- **lucide-react** - Icon library
- **framer-motion / motion** - Animations
- **class-variance-authority** - Variant management
- **clsx / tailwind-merge** - Class name utilities

---

## Migration Checklist

To implement this design system in another project:

1. ✅ Copy CSS variables to your globals.css
2. ✅ Add `screen-line-before` and `screen-line-after` utility classes
3. ✅ Add `dither-bg` utility class
4. ✅ Create `Panel`, `PanelHeader`, `PanelTitle`, `PanelContent` components
5. ✅ Create `Separator` component
6. ✅ Set up the brand color (`--brand-red` or your accent)
7. ✅ Configure the `--edge` color as a blend of border and background
8. ✅ Use `font-mono` for data display and `font-black uppercase tracking-tight` for titles
9. ✅ Wrap page content in a max-width container (`md:max-w-3xl`)
10. ✅ Stack components with `<Separator />` between each `<Panel />`


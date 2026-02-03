# GitHub Badge Implementation Guide

A comprehensive guide to implementing an animated GitHub repository badge with star count display from scratch.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Dependencies](#dependencies)
5. [Step-by-Step Implementation](#step-by-step-implementation)
6. [Code Explanation](#code-explanation)
7. [Styling & Animations](#styling--animations)
8. [Customization](#customization)
9. [Troubleshooting](#troubleshooting)
10. [Alternative Implementations](#alternative-implementations)

---

## Overview

The GitHub Badge is a fixed-position UI component that displays a link to your GitHub repository along with the current star count. It features:

- **Fixed positioning** in the top-right corner
- **Real-time star count** fetched from GitHub API
- **Smooth animations** using Framer Motion
- **Interactive hover effects** with glowing star animation
- **Click sound feedback** (optional)
- **Responsive design** for mobile and desktop

---

## Features

- ✅ Fetches live star count from GitHub API
- ✅ Animated entrance with spring physics
- ✅ Hover effects with glowing star animation
- ✅ Rotating gradient border on hover
- ✅ Click sound feedback
- ✅ Responsive positioning
- ✅ Smooth opacity transitions
- ✅ Active state feedback (scale down on click)

---

## Prerequisites

- React 18+ or Next.js 13+ project
- TypeScript (recommended)
- Tailwind CSS configured
- Basic understanding of React hooks and animations

---

## Dependencies

Install the required packages:

```bash
npm install framer-motion use-sound
# or
yarn add framer-motion use-sound
# or
pnpm add framer-motion use-sound
```

### Package Details

- **framer-motion** (^12.23.24): Animation library for React
- **use-sound** (^5.0.0): React hook for playing sound effects

**Note**: `use-sound` is optional. You can remove it if you don't want sound effects.

---

## Step-by-Step Implementation

### Step 1: Create the Component File

Create a new file: `components/github-badge.tsx` (or `components/GithubBadge.tsx`)

### Step 2: Set Up Basic Structure

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useSound from "use-sound"; // Optional

export function GithubBadge() {
  return (
    <a
      href="https://github.com/your-username/your-repo"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-[60px] right-4 z-50"
    >
      GitHub
    </a>
  );
}
```

### Step 3: Add State Management

```tsx
export function GithubBadge() {
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const starRef = useRef<SVGSVGElement>(null);

  // ... rest of component
}
```

**State Variables:**
- `githubStars`: Stores the fetched star count (null initially)
- `shouldAnimate`: Controls when animations should start
- `starRef`: Reference to the star SVG element (for potential future use)

### Step 4: Fetch GitHub Stars

Add the `useEffect` hook to fetch star count:

```tsx
useEffect(() => {
  const fetchGithubStars = async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO"
      );
      if (response.ok) {
        const data = await response.json();
        setGithubStars(data.stargazers_count);
        // Trigger animation once data is available
        setTimeout(() => setShouldAnimate(true), 100);
      }
    } catch (error) {
      console.warn("Failed to fetch GitHub stars:", error);
    }
  };
  fetchGithubStars();
}, []);
```

**Important**: Replace `YOUR_USERNAME/YOUR_REPO` with your actual GitHub repository path.

**GitHub API Endpoint Format:**
```
https://api.github.com/repos/{owner}/{repo}
```

**Response Structure:**
```json
{
  "stargazers_count": 123,
  "name": "repo-name",
  // ... other fields
}
```

### Step 5: Add Click Handler (Optional)

```tsx
const [playClick] = useSound("/sounds/click.mp3", { volume: 0.3 });

const handleClick = () => {
  playClick();
};
```

**Note**: If you don't want sound, you can remove this entirely or use a simple console.log.

### Step 6: Add GitHub Icon SVG

The GitHub icon is an SVG path. Add it inside the component:

```tsx
<motion.svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="text-white"
>
  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
  <path d="M9 18c-4.51 2-5-2-7-2"></path>
</motion.svg>
```

### Step 7: Add Star Icon with Gradient

```tsx
{githubStars !== null && shouldAnimate && (
  <motion.span 
    className="text-white text-sm font-medium flex items-center gap-1.5"
    key={githubStars}
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ 
      type: "spring", 
      stiffness: 120, 
      damping: 15,
      delay: 0.2
    }}
  >
    <div className="star-wrapper relative inline-block">
      <svg
        ref={starRef}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="star-icon text-yellow-400 relative"
        style={{
          filter: "drop-shadow(0 0 0.5px rgba(251, 191, 36, 0.2))",
        }}
      >
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.8)" />
            <stop offset="50%" stopColor="rgba(251, 191, 36, 1)" />
            <stop offset="100%" stopColor="rgba(251, 191, 36, 0.8)" />
          </linearGradient>
        </defs>
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill="url(#starGradient)"
        />
      </svg>
    </div>
    {githubStars}
  </motion.span>
)}
```

### Step 8: Add CSS Animations

Add the global styles for animations:

```tsx
<style jsx global>{`
  @keyframes starGlow {
    0% {
      filter: drop-shadow(0 0 0.5px rgba(251, 191, 36, 0.2)) 
              drop-shadow(0 0 1px rgba(251, 191, 36, 0.1))
              brightness(1);
      transform: scale(1);
    }
    25% {
      filter: drop-shadow(0 0 1px rgba(251, 191, 36, 0.3)) 
              drop-shadow(0 0 1.5px rgba(251, 191, 36, 0.15))
              brightness(1.03);
      transform: scale(1.005);
    }
    50% {
      filter: drop-shadow(0 0 1.5px rgba(251, 191, 36, 0.35)) 
              drop-shadow(0 0 2px rgba(251, 191, 36, 0.18))
              brightness(1.05);
      transform: scale(1.008);
    }
    75% {
      filter: drop-shadow(0 0 1px rgba(251, 191, 36, 0.3)) 
              drop-shadow(0 0 1.5px rgba(251, 191, 36, 0.15))
              brightness(1.03);
      transform: scale(1.005);
    }
    100% {
      filter: drop-shadow(0 0 0.5px rgba(251, 191, 36, 0.2)) 
              drop-shadow(0 0 1px rgba(251, 191, 36, 0.1))
              brightness(1);
      transform: scale(1);
    }
  }

  @keyframes gradientMove {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .github-badge:hover .star-icon {
    animation: starGlow 2.5s ease-in-out infinite;
  }

  .github-badge:hover .star-wrapper::before {
    content: '';
    position: absolute;
    inset: -1.5px;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      transparent 120deg,
      rgba(251, 191, 36, 0.12) 150deg,
      rgba(251, 191, 36, 0.18) 180deg,
      rgba(251, 191, 36, 0.12) 210deg,
      transparent 240deg,
      transparent 360deg
    );
    border-radius: 50%;
    animation: gradientMove 2.5s linear infinite;
    pointer-events: none;
    z-index: -1;
    filter: blur(1px);
  }

  .github-badge:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
`}</style>
```

**Note**: If you're not using Next.js with styled-jsx, you can add these styles to your global CSS file or use a CSS-in-JS solution.

### Step 9: Complete Component Structure

Combine everything into the final component:

```tsx
<motion.a
  href="https://github.com/YOUR_USERNAME/YOUR_REPO"
  target="_blank"
  rel="noopener noreferrer"
  onClick={handleClick}
  className="github-badge fixed top-[60px] right-4 md:top-[52px] md:right-6 z-50 flex items-center gap-2.5 px-4 py-2 md:px-5 md:py-2.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-md opacity-60 hover:opacity-100 transition-opacity duration-300 group"
  style={{ pointerEvents: "auto" }}
  initial={{ x: 0, opacity: 0.6 }}
  animate={shouldAnimate ? { x: -20, opacity: 0.6 } : { x: 0, opacity: 0.6 }}
  transition={{ 
    type: "spring", 
    stiffness: 100, 
    damping: 15
  }}
>
  {/* GitHub Icon */}
  {/* Star Count */}
</motion.a>
```

### Step 10: Add to Your Layout

Import and add the component to your main layout:

```tsx
// app/layout.tsx or pages/_app.tsx
import { GithubBadge } from "@/components/github-badge";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GithubBadge />
      </body>
    </html>
  );
}
```

---

## Code Explanation

### Component Architecture

```
GithubBadge Component
├── State Management
│   ├── githubStars: number | null
│   ├── shouldAnimate: boolean
│   └── starRef: RefObject<SVGSVGElement>
├── Effects
│   └── useEffect: Fetches star count on mount
├── Event Handlers
│   └── handleClick: Plays sound on click
└── Render
    ├── Global Styles (animations)
    └── Motion Anchor
        ├── GitHub Icon (SVG)
        └── Conditional Star Count Display
            ├── Star Icon (SVG with gradient)
            └── Star Number
```

### Key React Patterns

1. **Client Component**: Uses `"use client"` directive (Next.js 13+)
2. **State Management**: Uses `useState` for reactive updates
3. **Side Effects**: Uses `useEffect` for API calls
4. **Refs**: Uses `useRef` for DOM element references
5. **Conditional Rendering**: Only shows star count when data is available

### Framer Motion Usage

- **motion.a**: Animated anchor tag with spring physics
- **motion.svg**: Animated SVG icon
- **motion.span**: Animated span for star count entrance
- **initial/animate**: Define animation states
- **transition**: Configure animation timing and physics

### Animation Flow

1. Component mounts → `githubStars` is `null`
2. API call starts → Fetches star count
3. Data received → `setGithubStars(count)` → `setShouldAnimate(true)`
4. Badge slides left → Spring animation triggers
5. Star count fades in → After 200ms delay
6. Hover effects → CSS animations activate

---

## Styling & Animations

### Positioning

```tsx
className="fixed top-[60px] right-4 md:top-[52px] md:right-6 z-50"
```

- **Fixed positioning**: Stays in viewport
- **Top/Right**: Positioned from edges
- **Responsive**: Different positions for mobile/desktop
- **Z-index**: 50 ensures it's above other content

### Visual Styling

```tsx
className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-md"
```

- **Background**: Semi-transparent black (40% opacity)
- **Backdrop blur**: Glassmorphism effect
- **Border**: Subtle white border (10% opacity)
- **Rounded**: Medium border radius

### Opacity Transitions

```tsx
className="opacity-60 hover:opacity-100 transition-opacity duration-300"
```

- **Default**: 60% opacity (subtle)
- **Hover**: 100% opacity (prominent)
- **Transition**: Smooth 300ms change

### Spring Animations

```tsx
transition={{ 
  type: "spring", 
  stiffness: 100, 
  damping: 15
}}
```

- **Type**: Spring physics for natural motion
- **Stiffness**: 100 (moderate spring strength)
- **Damping**: 15 (controls oscillation)

### Star Glow Animation

The `starGlow` animation creates a pulsing glow effect:

- **Filter**: Multiple drop-shadows for depth
- **Brightness**: Slight increase at peak (1.05)
- **Scale**: Subtle scale change (1.008 max)
- **Duration**: 2.5 seconds
- **Easing**: ease-in-out for smooth transitions

### Rotating Gradient Border

The `gradientMove` animation creates a rotating border:

- **Conic gradient**: Creates a circular gradient
- **Rotation**: 360 degrees continuous
- **Colors**: Yellow glow (rgba(251, 191, 36))
- **Blur**: 1px for softness
- **Position**: Absolute, behind star icon

---

## Customization

### Change Repository

Update the GitHub API URL and link:

```tsx
// In fetchGithubStars
const response = await fetch(
  "https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO"
);

// In motion.a href
href="https://github.com/YOUR_USERNAME/YOUR_REPO"
```

### Change Position

Modify the Tailwind classes:

```tsx
// Top-left
className="fixed top-4 left-4"

// Bottom-right
className="fixed bottom-4 right-4"

// Center-top
className="fixed top-4 left-1/2 -translate-x-1/2"
```

### Change Colors

Update the color values:

```tsx
// Badge background
className="bg-blue-500/40" // Blue instead of black

// Star color
className="star-icon text-blue-400" // Blue star

// Gradient colors
stopColor="rgba(59, 130, 246, 0.8)" // Blue gradient
```

### Change Animation Speed

Modify animation durations:

```tsx
// Star glow speed
animation: starGlow 1s ease-in-out infinite; // Faster

// Gradient rotation speed
animation: gradientMove 1s linear infinite; // Faster

// Spring animation
transition={{ 
  type: "spring", 
  stiffness: 200, // Faster spring
  damping: 20
}}
```

### Remove Sound Effects

Remove the `use-sound` dependency:

```tsx
// Remove this import
// import useSound from "use-sound";

// Remove this line
// const [playClick] = useSound("/sounds/click.mp3", { volume: 0.3 });

// Simplify handleClick
const handleClick = () => {
  // Optional: Add analytics or other logic
};
```

### Add Loading State

Show a loading indicator while fetching:

```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchGithubStars = async () => {
    setIsLoading(true);
    try {
      // ... fetch logic
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  fetchGithubStars();
}, []);

// In render
{isLoading ? (
  <span>Loading...</span>
) : (
  // Star count display
)}
```

### Add Error Handling UI

Show error state if fetch fails:

```tsx
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchGithubStars = async () => {
    try {
      // ... fetch logic
      setError(null);
    } catch (error) {
      setError("Failed to load stars");
    }
  };
  fetchGithubStars();
}, []);

// In render
{error && <span className="text-red-400">{error}</span>}
```

### Change Star Icon Style

Use a different star icon or style:

```tsx
// Filled star
<polygon
  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
  fill="currentColor"
/>

// Outlined star (remove fill, add stroke)
<polygon
  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
/>
```

---

## Troubleshooting

### Stars Not Showing

**Problem**: Star count doesn't appear

**Solutions**:
1. Check GitHub API URL is correct
2. Verify repository is public (private repos require authentication)
3. Check browser console for errors
4. Verify `githubStars` state is being set
5. Check `shouldAnimate` is `true`

```tsx
// Add debugging
useEffect(() => {
  console.log("GitHub stars:", githubStars);
  console.log("Should animate:", shouldAnimate);
}, [githubStars, shouldAnimate]);
```

### CORS Errors

**Problem**: CORS error when fetching from GitHub API

**Solutions**:
- GitHub API doesn't require CORS headers for public repos
- If using a proxy, ensure it's configured correctly
- Check network tab for actual error message

### Animation Not Working

**Problem**: Animations don't trigger

**Solutions**:
1. Verify Framer Motion is installed correctly
2. Check if component is client-side (`"use client"`)
3. Verify CSS animations are loaded
4. Check browser console for errors

### Sound Not Playing

**Problem**: Click sound doesn't play

**Solutions**:
1. Verify sound file exists at `/sounds/click.mp3`
2. Check browser autoplay policies
3. Verify `use-sound` is installed
4. Check browser console for errors

### Badge Overlaps Content

**Problem**: Badge covers important content

**Solutions**:
1. Adjust z-index (lower value)
2. Change position (different corner)
3. Add margin to content that's being covered
4. Make badge smaller on mobile

```tsx
// Lower z-index
className="z-30" // Instead of z-50

// Hide on mobile
className="hidden md:flex" // Hide on small screens
```

### Performance Issues

**Problem**: Component causes performance problems

**Solutions**:
1. Debounce API calls
2. Cache star count (localStorage)
3. Reduce animation complexity
4. Use `React.memo` to prevent re-renders

```tsx
// Cache stars
useEffect(() => {
  const cached = localStorage.getItem('githubStars');
  if (cached) {
    setGithubStars(Number(cached));
  }
  
  // Fetch fresh data
  fetchGithubStars().then(stars => {
    localStorage.setItem('githubStars', String(stars));
  });
}, []);
```

---

## Alternative Implementations

### Without Framer Motion

If you want to avoid Framer Motion dependency:

```tsx
import { useState, useEffect } from "react";

export function GithubBadge() {
  const [githubStars, setGithubStars] = useState<number | null>(null);

  useEffect(() => {
    // ... fetch logic
  }, []);

  return (
    <a
      href="https://github.com/YOUR_USERNAME/YOUR_REPO"
      className="github-badge fixed top-4 right-4 z-50"
    >
      <span>⭐ {githubStars || "..."}</span>
    </a>
  );
}
```

### With CSS Modules

Instead of styled-jsx, use CSS modules:

```tsx
// github-badge.module.css
.starGlow {
  animation: starGlow 2.5s ease-in-out infinite;
}

@keyframes starGlow {
  /* ... animation keyframes */
}
```

```tsx
// Component
import styles from './github-badge.module.css';

<div className={styles.starGlow}>
  {/* Star icon */}
</div>
```

### With Styled Components

```tsx
import styled, { keyframes } from 'styled-components';

const starGlow = keyframes`
  /* ... animation keyframes */
`;

const StarIcon = styled.svg`
  animation: ${starGlow} 2.5s ease-in-out infinite;
`;
```

### Server-Side Rendering (SSR)

For Next.js with SSR:

```tsx
// components/github-badge.tsx (Server Component)
async function getGithubStars() {
  const res = await fetch(
    'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO',
    { next: { revalidate: 3600 } } // Revalidate every hour
  );
  const data = await res.json();
  return data.stargazers_count;
}

export async function GithubBadge() {
  const stars = await getGithubStars();
  
  return (
    <a href="https://github.com/YOUR_USERNAME/YOUR_REPO">
      ⭐ {stars}
    </a>
  );
}
```

---

## Complete Example

Here's the complete component ready to use:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useSound from "use-sound"; // Optional

interface GithubBadgeProps {
  username: string;
  repo: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  showSound?: boolean;
}

export function GithubBadge({ 
  username, 
  repo, 
  position = "top-right",
  showSound = true 
}: GithubBadgeProps) {
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const starRef = useRef<SVGSVGElement>(null);
  const [playClick] = useSound("/sounds/click.mp3", { volume: 0.3 });

  useEffect(() => {
    const fetchGithubStars = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${username}/${repo}`
        );
        if (response.ok) {
          const data = await response.json();
          setGithubStars(data.stargazers_count);
          setTimeout(() => setShouldAnimate(true), 100);
        }
      } catch (error) {
        console.warn("Failed to fetch GitHub stars:", error);
      }
    };
    fetchGithubStars();
  }, [username, repo]);

  const handleClick = () => {
    if (showSound) playClick();
  };

  const positionClasses = {
    "top-right": "top-[60px] right-4 md:top-[52px] md:right-6",
    "top-left": "top-[60px] left-4 md:top-[52px] md:left-6",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <>
      {/* Add CSS animations here */}
      <motion.a
        href={`https://github.com/${username}/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`github-badge fixed ${positionClasses[position]} z-50 flex items-center gap-2.5 px-4 py-2 md:px-5 md:py-2.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-md opacity-60 hover:opacity-100 transition-opacity duration-300 group`}
        style={{ pointerEvents: "auto" }}
        initial={{ x: 0, opacity: 0.6 }}
        animate={shouldAnimate ? { x: -20, opacity: 0.6 } : { x: 0, opacity: 0.6 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15
        }}
      >
        {/* GitHub Icon */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
          <path d="M9 18c-4.51 2-5-2-7-2"></path>
        </motion.svg>
        
        {/* Star Count */}
        {githubStars !== null && shouldAnimate && (
          <motion.span 
            className="text-white text-sm font-medium flex items-center gap-1.5"
            key={githubStars}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 15,
              delay: 0.2
            }}
          >
            <div className="star-wrapper relative inline-block">
              <svg
                ref={starRef}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="star-icon text-yellow-400 relative"
                style={{
                  filter: "drop-shadow(0 0 0.5px rgba(251, 191, 36, 0.2))",
                }}
              >
                <defs>
                  <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(251, 191, 36, 0.8)" />
                    <stop offset="50%" stopColor="rgba(251, 191, 36, 1)" />
                    <stop offset="100%" stopColor="rgba(251, 191, 36, 0.8)" />
                  </linearGradient>
                </defs>
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  fill="url(#starGradient)"
                />
              </svg>
            </div>
            {githubStars}
          </motion.span>
        )}
      </motion.a>
    </>
  );
}
```

**Usage:**

```tsx
<GithubBadge 
  username="crafter-station" 
  repo="peru.ai-hackathon.co"
  position="top-right"
  showSound={true}
/>
```

---

## Summary

This guide provides everything you need to implement a GitHub badge component from scratch. The component features:

- ✅ Real-time star count fetching
- ✅ Smooth animations
- ✅ Interactive hover effects
- ✅ Responsive design
- ✅ Customizable positioning and styling

Remember to:
1. Install required dependencies
2. Replace repository URLs with your own
3. Add sound file if using sound effects
4. Customize colors and positioning to match your design
5. Test on different screen sizes

Happy coding! 🚀






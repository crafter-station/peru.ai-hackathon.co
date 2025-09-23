"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

type Position = [number, number, number];

interface BoxWithEdgesProps {
  position: Position;
  color: string;
  edgeColor?: string;
}

interface BoxLetterProps {
  letter: string;
  position: Position;
}

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Individual building block for letters - a 3D cube with edges
 * Each cube is 0.5x0.5x0.5 units with glossy blue material and dark blue edges
 */
const BoxWithEdges = ({ position, color, edgeColor }: BoxWithEdgesProps) => {
  return (
    <group position={position}>
      {/* Main cube mesh with physical material for realistic lighting */}
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.1} // Very smooth surface
          metalness={0.8} // Metallic appearance
          transparent={true}
          opacity={0.9} // Slightly transparent
          transmission={0.5} // Glass-like transmission
          clearcoat={1} // Glossy coating
        />
      </mesh>
      {/* Edge lines to define cube boundaries */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.5)]} />
        <lineBasicMaterial color={edgeColor ?? "#5a5a5a"} linewidth={2} />
      </lineSegments>
    </group>
  );
};

/**
 * Creates a 3D letter from a grid of cubes
 * Each letter is defined as a 2D matrix where 1 = cube, 0 = empty space
 */
const BoxLetter = ({ letter, position }: BoxLetterProps) => {
  const group = useRef<THREE.Group>(null);

  /**
   * Letter definitions as 2D matrices (5 rows each)
   * Each array represents one row of the letter from top to bottom
   * 1 = place a cube, 0 = empty space
   *
   * Visual representation:
   * N: Diagonal letter with vertical sides
   * E: Horizontal lines with left vertical
   * X: Diagonal cross pattern
   * T: Horizontal top with vertical center
   */
  const getLetterShape = (letter: string): number[][] => {
    const shapes: Record<string, number[][]> = {
      // Letter I: 3x5 grid
      I: [
        [1, 1, 1], // ■■■
        [0, 1, 0], //  ■
        [0, 1, 0], //  ■
        [0, 1, 0], //  ■
        [1, 1, 1], // ■■■
      ],
      // Letter A: 5x5 grid
      A: [
        [0, 0, 1, 0, 0], //   ■
        [0, 1, 0, 1, 0], //  ■ ■
        [1, 0, 0, 0, 1], // ■   ■
        [1, 1, 1, 1, 1], // ■■■■■
        [1, 0, 0, 0, 1], // ■   ■
      ],
      // Letter H: 5x5 grid
      H: [
        [1, 0, 0, 0, 1], // ■   ■
        [1, 0, 0, 0, 1], // ■   ■
        [1, 1, 1, 1, 1], // ■■■■■
        [1, 0, 0, 0, 1], // ■   ■
        [1, 0, 0, 0, 1], // ■   ■
      ],
      // Letter C: 4x5 grid
      C: [
        [0, 1, 1, 1], //  ■■■
        [1, 0, 0, 0], // ■
        [1, 0, 0, 0], // ■
        [1, 0, 0, 0], // ■
        [0, 1, 1, 1], //  ■■■
      ],
      // Letter K: 4x5 grid
      K: [
        [1, 0, 0, 1], // ■  ■
        [1, 0, 1, 0], // ■ ■
        [1, 1, 0, 0], // ■■
        [1, 0, 1, 0], // ■ ■
        [1, 0, 0, 1], // ■  ■
      ],
      // Letter O: 5x5 grid
      O: [
        [0, 1, 1, 1, 0], //  ■■■
        [1, 0, 0, 0, 1], // ■   ■
        [1, 0, 0, 0, 1], // ■   ■
        [1, 0, 0, 0, 1], // ■   ■
        [0, 1, 1, 1, 0], //  ■■■
      ],
      // Letter N: 5x5 grid with diagonal
      N: [
        [1, 0, 0, 0, 1], // ■   ■
        [1, 1, 0, 0, 1], // ■■  ■
        [1, 0, 1, 0, 1], // ■ ■ ■
        [1, 0, 0, 1, 1], // ■  ■■
        [1, 0, 0, 0, 1], // ■   ■
      ],
      // Letter E: 3x5 grid
      E: [
        [1, 1, 1], // ■■■
        [1, 0, 0], // ■
        [1, 1, 0], // ■■
        [1, 0, 0], // ■
        [1, 1, 1], // ■■■
      ],
      // Letter X: 5x5 grid with diagonals
      X: [
        [1, 0, 0, 0, 1], // ■   ■
        [0, 1, 0, 1, 0], //  ■ ■
        [0, 0, 1, 0, 0], //   ■
        [0, 1, 0, 1, 0], //  ■ ■
        [1, 0, 0, 0, 1], // ■   ■
      ],
      // Letter T: 3x5 grid
      T: [
        [1, 1, 1], // ■■■
        [0, 1, 0], //  ■
        [0, 1, 0], //  ■
        [0, 1, 0], //  ■
        [0, 1, 0], //  ■
      ],
    };
    return shapes[letter] || shapes["N"];
  };

  const letterShape = getLetterShape(letter);

  return (
    <group ref={group} position={position}>
      {/* 
        Convert 2D matrix to 3D cubes:
        - Iterate through each row (i) and column (j) of the letter matrix
        - For each cell with value 1, create a BoxWithEdges component
        - Position calculation: xOffset (horizontal), yOffset (vertical), z=0 (depth)
      */}
      {letterShape.flatMap((row: number[], rowIndex: number) =>
        row.map((cell: number, colIndex: number) => {
          if (cell) {
            // Calculate horizontal position (xOffset) for each cube
            // Different letters have different widths, so we center them accordingly
            let xOffset = 0;

            // Calculate centering offset based on letter width
            const letterWidths: Record<string, number> = {
              I: 3,
              A: 5,
              H: 5,
              C: 4,
              K: 4,
              O: 5,
              N: 5,
              E: 3,
              X: 5,
              T: 3,
            };
            const letterWidth = letterWidths[letter] || 3;
            const centerOffset = (letterWidth - 1) * 0.25; // Center the letter

            // Base positioning with centering
            xOffset = colIndex * 0.5 - centerOffset;

            // Custom positioning for letters with special alignment needs
            if (
              letter === "N" ||
              letter === "A" ||
              letter === "H" ||
              letter === "O" ||
              letter === "X"
            ) {
              // 5-column letters: custom spacing for better visual alignment
              const positions = [-1, -0.5, 0, 0.5, 1];
              if (colIndex < positions.length) {
                xOffset = positions[colIndex];
              }
            } else if (letter === "C" || letter === "K") {
              // 4-column letters
              const positions = [-0.75, -0.25, 0.25, 0.75];
              if (colIndex < positions.length) {
                xOffset = positions[colIndex];
              }
            } else if (letter === "I" || letter === "E" || letter === "T") {
              // 3-column letters
              const positions = [-0.5, 0, 0.5];
              if (colIndex < positions.length) {
                xOffset = positions[colIndex];
              }
            }

            // Peru flag colors across letter columns: Red-White-Red
            const PERU_RED = "#D91023";
            const PERU_WHITE = "#D91023";
            const PERU_RED_EDGE = "#8A0E18";
            const PERU_WHITE_EDGE = "#4A4A4A";

            const fraction = (colIndex + 0.5) / (letterWidth || 1);
            const isRedBand = fraction < 1 / 3 || fraction > 2 / 3;
            const faceColor = isRedBand ? PERU_RED : PERU_WHITE;
            const borderColor = isRedBand ? PERU_RED_EDGE : PERU_WHITE_EDGE;

            return (
              <BoxWithEdges
                key={`cube-${letter}-r${rowIndex}c${colIndex}-${Math.round(xOffset * 10)}-${Math.round((4 - rowIndex) * 0.5 * 10)}`}
                position={[
                  xOffset, // X: horizontal position
                  (4 - rowIndex) * 0.5 - 1, // Y: vertical position (inverted, top row = highest Y)
                  0, // Z: depth (all cubes at same depth)
                ]}
                color={faceColor}
                edgeColor={borderColor}
              />
            );
          }
          return null;
        }).filter(Boolean)
      )}
    </group>
  );
};

/**
 * Main 3D scene containing the "NEXT" text and lighting
 */
const Scene = () => {
  const orbitControlsRef = useRef<any>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  return (
    <>
      {/* 
        "IA HACKATHON" construction:
        - Two groups: "IA" on top row, "HACKATHON" on bottom row
        - Each letter positioned with spacing between centers
        - Arranged in two lines for better fit and readability
      */}
      <group position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
        {/* Top row: "IA" - commented out */}
        {/* <group position={[0, 1.5, 0]}>
          <BoxLetter letter="I" position={[-1.5, 0, 0]} />
          <BoxLetter letter="A" position={[1.5, 0, 0]} />
        </group> */}

        {/* Bottom row: "HACKATHON" - commented out */}
        {/* <group position={[0, -1.5, 0]}>
          <BoxLetter letter="H" position={[-11, 0, 0]} />
          <BoxLetter letter="A" position={[-8, 0, 0]} />
          <BoxLetter letter="C" position={[-5.5, 0, 0]} />
          <BoxLetter letter="K" position={[-3, 0, 0]} />
          <BoxLetter letter="A" position={[-0.5, 0, 0]} />
          <BoxLetter letter="T" position={[2, 0, 0]} />
          <BoxLetter letter="H" position={[5, 0, 0]} />
          <BoxLetter letter="O" position={[8, 0, 0]} />
          <BoxLetter letter="N" position={[11, 0, 0]} />
        </group> */}
      </group>
      <OrbitControls
        ref={orbitControlsRef}
        enableZoom
        enablePan
        enableRotate
        autoRotate
        autoRotateSpeed={2}
      />

      <ambientLight intensity={0.5} />

      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />

      <Environment
        files={
          isMobileDevice
            ? "https://26evcbcedv5nczlx.public.blob.vercel-storage.com/machu-picchu-1X.jpg"
            : "https://26evcbcedv5nczlx.public.blob.vercel-storage.com/machu-picchu-1X.jpg"
        }
        background
      />
    </>
  );
};

/**
 * Block-style letter component to simulate Minecraft/3D block font
 */
const BlockLetter = ({ letter, size = 'large' }: { letter: string; size?: 'large' | 'small' }) => {
  const getLetterBlocks = (letter: string) => {
    const patterns: Record<string, number[][]> = {
      A: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
      ],
      I: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
      ],
      H: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
      ],
      C: [
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 1, 1, 1],
      ],
      K: [
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 0],
        [1, 0, 1, 0],
        [1, 0, 0, 1],
      ],
      T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
      O: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
      ],
      N: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
      ],
    };
    return patterns[letter] || patterns['A'];
  };

  const pattern = getLetterBlocks(letter);
  const blockSize = size === 'large' ? 'w-3 h-3 md:w-4 md:h-4' : 'w-2 h-2 md:w-3 md:h-3';
  
  return (
    <div className="inline-block mx-1">
      {pattern.map((row, rowIndex) => (
        <div key={`${letter}-r${rowIndex}-${row.join('')}`} className="flex">
          {row.map((block, colIndex) => (
            <div
              key={`${letter}-b${rowIndex}${colIndex}-${block}`}
              className={`${blockSize} ${block ? 'bg-foreground' : 'bg-transparent'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Loading component that shows 2D "IA HACKATHON" text while 3D model loads
 */
const LoadingComponent = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background">
      {/* Main loading content */}
      <div className="text-center">
        {/* IA text using block letters */}
        <div className="flex justify-center items-center mb-6">
          <BlockLetter letter="I" size="large" />
          <BlockLetter letter="A" size="large" />
        </div>
        
        {/* HACKATHON text using block letters */}
        <div className="flex justify-center items-center flex-wrap mb-6">
          <BlockLetter letter="H" size="small" />
          <BlockLetter letter="A" size="small" />
          <BlockLetter letter="C" size="small" />
          <BlockLetter letter="K" size="small" />
          <BlockLetter letter="A" size="small" />
          <BlockLetter letter="T" size="small" />
          <BlockLetter letter="H" size="small" />
          <BlockLetter letter="O" size="small" />
          <BlockLetter letter="N" size="small" />
        </div>
        
        {/* Simple loading indicator */}
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-foreground animate-pulse"></div>
          <div className="w-2 h-2 bg-foreground animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-foreground animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};


/**
 * Helper component to detect when Three.js scene is ready
 */
const LoadingEffect = ({ onLoaded }: { onLoaded: () => void }) => {
  useEffect(() => {
    // Wait for next frame to ensure everything is rendered
    const timer = setTimeout(() => {
      onLoaded();
    }, 1500); // Minimum loading time

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return null;
};

/**
 * Main component that renders the 3D "IA HACKATHON" text with loading state
 *
 * Text Construction Process:
 * 1. Each letter (I,A,H,C,K,O,N,E,X,T) is defined as a 2D matrix in getLetterShape()
 * 2. BoxLetter component converts matrix to 3D cubes using nested map()
 * 3. Each matrix cell with value 1 becomes a BoxWithEdges component
 * 4. Position calculation:
 *    - X: horizontal spacing with custom offsets for different letter widths
 *    - Y: vertical position (inverted, row 0 = top)
 *    - Z: all cubes at same depth (0)
 * 5. Letters arranged in two rows: "IA" on top, "HACKATHON" on bottom
 * 6. Entire text group rotated for 3D perspective view
 * 7. Loading state shows 2D "IA HACKATHON" until 3D model is ready
 */
export default function Component() {
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);

  return (
    <div className="relative w-full h-screen bg-background">
      {/* Loading state - 2D "IA HACKATHON" */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isSceneLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <LoadingComponent />
      </div>

      {/* 3D Canvas */}
      <div className={`w-full h-full transition-opacity duration-1000 ${isSceneLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Canvas camera={{ position: [15, 2, 20], fov: 60 }}>
          <Scene />
          <LoadingEffect onLoaded={() => setIsSceneLoaded(true)} />
        </Canvas>
      </div>
    </div>
  );
}

"use client";

/**
 * Block-style letter component to simulate Minecraft/3D block font
 */
export const BlockLetter = ({ letter, size = 'large' }: { letter: string; size?: 'large' | 'small' }) => {
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
              className={`${blockSize} ${block ? 'bg-white' : 'bg-transparent'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

import { useState, useEffect } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
}

export function useImageDimensions(urls: string[], maxMeasure: number = 40) {
  const [dimensionsByUrl, setDimensionsByUrl] = useState<Record<string, ImageDimensions>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!urls.length) return;

    const urlsToMeasure = urls
      .filter(url => url && !dimensionsByUrl[url])
      .slice(0, maxMeasure);

    if (!urlsToMeasure.length) return;

    setIsLoading(true);

    const measureImage = (url: string): Promise<{ url: string; dimensions: ImageDimensions | null }> => {
      return new Promise((resolve) => {
        const img = new globalThis.Image();
        
        const cleanup = () => {
          img.onload = null;
          img.onerror = null;
        };

        img.onload = () => {
          cleanup();
          resolve({
            url,
            dimensions: {
              width: img.naturalWidth || img.width,
              height: img.naturalHeight || img.height,
            },
          });
        };

        img.onerror = () => {
          cleanup();
          resolve({
            url,
            dimensions: null, // Will fall back to default dimensions
          });
        };

        // Set crossOrigin to handle CORS if needed
        img.crossOrigin = 'anonymous';
        img.src = url;
      });
    };

    const measureAllImages = async () => {
      try {
        const results = await Promise.allSettled(
          urlsToMeasure.map(url => measureImage(url))
        );

        const newDimensions: Record<string, ImageDimensions> = {};

        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.dimensions) {
            newDimensions[result.value.url] = result.value.dimensions;
          }
        });

        setDimensionsByUrl(prev => ({ ...prev, ...newDimensions }));
      } catch (error) {
        console.warn('Error measuring image dimensions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    measureAllImages();
  }, [urls, maxMeasure, dimensionsByUrl]);

  return { dimensionsByUrl, isLoading };
}

export interface PixelData {
  r: number;
  g: number;
  b: number;
  hex: string;
}

export interface ProcessedImage {
  grid: PixelData[][];
  width: number;
  height: number;
}

/** Largest image accepted from the file picker. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** Longest edge of the generated pixel grid, in cells. */
export const DEFAULT_TARGET_SIZE = 80;

export async function processImage(
  file: File,
  targetSize: number = DEFAULT_TARGET_SIZE
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    // Every exit path must release the object URL, or the decoded image is
    // pinned in memory for the lifetime of the document.
    const cleanUp = () => URL.revokeObjectURL(objectUrl);

    img.onload = () => {
      try {
        if (img.width === 0 || img.height === 0) {
          reject(new Error('Image has no dimensions'));
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate dimensions to maintain aspect ratio within targetSize
        let width = targetSize;
        let height = targetSize;
        if (img.width > img.height) {
          height = Math.max(1, Math.round((img.height / img.width) * targetSize));
        } else {
          width = Math.max(1, Math.round((img.width / img.height) * targetSize));
        }

        canvas.width = width;
        canvas.height = height;
        // Pre-fill with white so transparent areas composite correctly
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const grid: PixelData[][] = [];

        for (let y = 0; y < height; y++) {
          const row: PixelData[] = [];
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

            row.push({ r, g, b, hex });
          }
          grid.push(row);
        }

        resolve({ grid, width, height });
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to process image'));
      } finally {
        cleanUp();
      }
    };

    img.onerror = () => {
      cleanUp();
      reject(new Error('Could not decode image'));
    };

    img.src = objectUrl;
  });
}

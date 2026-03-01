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

export async function processImage(
  file: File,
  targetSize: number = 80
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
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
        height = Math.round((img.height / img.width) * targetSize);
      } else {
        width = Math.round((img.width / img.height) * targetSize);
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
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

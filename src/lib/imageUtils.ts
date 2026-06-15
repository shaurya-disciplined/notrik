export const compressImage = (file: File, maxSize: number = 1500, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Only compress images. Ignore PDFs or text files.
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Proportional resizing
        if (width > height) {
          if (width > maxSize) {
            height = Math.round(height * (maxSize / width));
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round(width * (maxSize / height));
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback to original if canvas context fails
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Convert to JPEG for consistent output and better compression
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              resolve(file); // Fallback
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = (error) => {
        console.error("Error loading image for compression", error);
        resolve(file); // Fallback to original
      };
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file for compression", error);
      resolve(file); // Fallback to original
    };
  });
};

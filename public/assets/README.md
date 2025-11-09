# Assets Directory Structure

This directory contains all the static assets for the Honda Bolinao website.

## Directory Structure:

### `/images/`
Main directory for all image assets

#### `/images/motorcycles/`
- Product images for Honda motorcycles
- Recommended naming: `model-name-color.jpg` or `model-name-angle.jpg`
- Examples:
  - `navi-red.jpg`
  - `beat-playful-blue.jpg`
  - `click125-white.jpg`
  - `giorno-pink.jpg`

#### `/images/banners/`
- Hero section banners
- Promotional banners
- Category banners
- Recommended sizes: 1920x1080 for hero banners

#### `/images/logos/`
- Honda logos
- Partner logos
- Brand assets
- Icons and symbols

## Image Guidelines:

1. **Format**: Use `.jpg` for photos, `.png` for logos/graphics with transparency
2. **Size**: Optimize images for web (compress to reasonable file sizes)
3. **Naming**: Use lowercase, kebab-case naming (e.g., `honda-navi-red.jpg`)
4. **Dimensions**: Maintain consistent aspect ratios for product images

## Usage in Code:

```tsx
import Image from 'next/image';

// Example usage:
<Image 
  src="/assets/images/motorcycles/navi-red.jpg" 
  alt="Honda NAVi Red" 
  width={400} 
  height={300}
/>
```

## Current Placeholders:
- All motorcycle images are currently using emoji placeholders (🏍️)
- Replace these with actual Honda motorcycle images
- Update the ProductCard component to use real image paths
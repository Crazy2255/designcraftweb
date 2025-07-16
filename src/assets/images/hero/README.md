# Hero Slider Images

Place your real hero slider images in this folder (ecommerce/src/assets/images/hero/).

For example:
- 1.jpg - First slide image
- 2.jpg - Second slide image
- 3.jpg - Third slide image

Then update the paths in `src/assets/placeholderImages.js` to use these images:

```javascript
// This file exports images for development
const placeholderImages = {
  hero1: require('./images/hero/1.jpg'),
  hero2: require('./images/hero/2.jpg'),
  hero3: require('./images/hero/3.jpg'),
  // ... other images
};

export default placeholderImages;
```

For optimal slider performance, use images that are:
- Same dimensions (recommended 1200×600 pixels)
- Optimized for web (compressed JPG or WebP format)
- Good quality but not excessively large file size 
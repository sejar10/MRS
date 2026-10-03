# MRS Collections — Premium Static v2

This is a production-style, dependency-free storefront frontend designed for GitHub Pages.

## What is included
- Editorial fashion homepage with premium responsive layout.
- Category browsing across: Sarees, Kurtis, Dresses, Tops, Co-ord Sets, Blouses, Jewellery, Accessories.
- Product search, category filter, availability filter and sorting.
- Product quick view with multi-image gallery.
- WhatsApp enquiry flow — no checkout or payment integration.
- Enquiry bag: customers can collect multiple pieces and send one WhatsApp message.
- Internal `stock` quantity exists in `products.js`, but exact quantity is never shown publicly.
- Responsive mobile navigation and accessibility-focused controls.
- LocalStorage keeps the enquiry bag on the same device.
- SEO metadata + basic JSON-LD.

## Add real products later
Edit `products.js` and replace each product's `images` array with your real image paths, for example:

```js
images: [
  'assets/products/royal-bloom-front.jpg',
  'assets/products/royal-bloom-back.jpg',
  'assets/products/royal-bloom-detail.jpg'
]
```

Change `name`, `category`, `price`, `material`, `colors`, `description`, and internal `stock` there.

## GitHub Pages
Upload everything inside this folder to the root of a GitHub repository, then enable:
`Settings → Pages → Deploy from branch → main → /(root)`.

## Important architecture note
GitHub Pages is static hosting. The `stock` value in `products.js` is not a secure inventory database and should not be treated as an admin system. The next production step is a private authenticated admin panel backed by a database/API.

## WhatsApp
Business number is configured in `app.js` as `919080807289` (India country code + number).

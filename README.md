# vite-starter

starter template for static markup built with vite, vituum, twig, scss, typescript

## setup

```bash
npm install
```

## scripts

```bash
npm run dev       # dev server
npm run build     # build to dist
npm run preview   # preview the built dist
npm run lint      # eslint + stylelint
```

## structure

```
src/
  pages/               twig pages
  layouts/             base templates
  components/          twig components
  styles/              scss, entry point main.scss
  scripts/             typescript, entry point main.ts
public/
  images/              static assets, sprite.svg
vite-plugins/
  asset-manifest.js    generates js/assets-manifest.json on build
```

## build

js and css filenames contain a hash, the asset manifest with paths is at `dist/js/assets-manifest.json`

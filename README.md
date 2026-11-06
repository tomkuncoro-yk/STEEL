# STEEL-SPIR

Sheffield Texts Exploration and Examination Lab.

Front page for a collection of small, browser-only data tools. Vite + React + TypeScript, plain CSS, no backend.

## Run it

```powershell
npm install
npm run dev      # local preview
npm run build    # static site in dist/
```

The build uses relative paths (`base: './'`), so the `dist` folder can be hosted from any folder or subpath.

## Where things are

- `src/tools.ts` is the registry of tool groups. Each group has a name, blurb, list of tools, and illustration. The front page is generated from it, so adding or renaming a group means editing this one file.
- `src/App.tsx` holds the header, footer and routes. `src/pages/Home.tsx` is the front page and `src/pages/GroupPage.tsx` is the "under construction" page for groups that are not built yet.
- `src/pages/FilterAndCount.tsx` is the working Filter and count page: upload a CSV, choose a column, run the four tools.
- `src/lib/analysis.ts` holds the counting logic (hashtags, emoji, word frequencies, specific terms). It is plain TypeScript with no React, so it is easy to test on its own. `stopwords.ts` has the English and Indonesian word lists.
- `src/components/` holds the screen pieces (upload step, column step, tool panel, results table, bar chart) and `src/components/tools/` has one file per tool.
- `src/index.css` holds the design tokens (colours, fonts, radii) at the top, then the styles. `src/tool-page.css` has the styles for the tool pages.

To mark a group as finished, delete its `underConstruction: true` line in `src/tools.ts`.
- `src/assets/art/` holds the illustrations, one per group.

## Credits

Illustrations are from [Open Doodles](https://www.opendoodles.com/) by Pablo Stanley (CC0), recoloured to the site's palette. Fonts (Inter, DM Sans, Architects Daughter) are bundled via Fontsource, so the site makes no outside requests.

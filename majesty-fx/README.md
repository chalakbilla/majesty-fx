# Majesty FX — Vite + React frontend clone

## Run it on Windows

Double-click `launch.bat`. It checks for Node.js, installs dependencies on the first run, starts the dev server, and opens http://localhost:5173 in your browser.

## Run it manually

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Deploy to Vercel

Vercel detects Vite automatically. `vercel.json` already sets the install command, build command (`npm run build`) and output folder (`dist`).

1. Push this folder to a GitHub, GitLab or Bitbucket repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Leave the detected settings as they are (Framework: Vite) and click **Deploy**.

Every push to the main branch redeploys automatically. To deploy from the terminal instead, run `npx vercel` in this folder and then `npx vercel --prod`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Structure

```
src/
  App.jsx                    page composition (section order matches the reference)
  data.js                    all text, prices, reviews, FAQs, account tiers, footer links
  index.css                  full stylesheet (responsive, incl. mobile nav)
  components/
    TickerBar.jsx            top live ticker, scrolls right → left
    Navbar.jsx               sticky header with mobile menu
    Hero.jsx                 hero copy, phone mockup, floating "Raw Spreads" pill
    TradeClarity.jsx         "Trade with clarity" block + stats strip
    Instruments.jsx          instrument cards, market categories, live screener table
    Platforms.jsx            MetaTrader 5, WebTrader, Mobile Trading
    Accounts.jsx             account tiers + margin/PnL calculator (interactive)
    Onboarding.jsx           3-step timeline (Create / Verify / Fund & Trade)
    Education.jsx            Academy + Trader Tools cards
    Reviews.jsx              two opposite marquees (top: right→left, bottom: left→right)
    FAQ.jsx                  accordion
    CTA.jsx                  closing call-to-action
    Footer.jsx               risk warning, link columns, legal text
src/assets/                  images taken from Resource.zip
```

## Notes

- Fonts (Montserrat, Inter, JetBrains Mono) load from Google Fonts in `index.html`.
- The screener prices and the ticker are simulated in the browser. To use live data, replace the `useEffect` in `Instruments.jsx` and the ticker data in `data.js` with a feed.
- Stocks, Indices and Crypto cards use the images in the zip where one matched. The Crypto card has no matching image in the zip, so it uses a gradient placeholder.
- Review text in the top row is rewritten, because the PDF's text there was overlapped and unreadable.
- The forex (1)/(2)/(3) duplicates and `mobile.avif` in the zip are not used.

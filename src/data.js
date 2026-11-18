import avatar1 from './assets/avatar-1.jpg';
import avatar2 from './assets/avatar-2.jpg';
import avatar3 from './assets/avatar-3.jpg';
import avatar4 from './assets/avatar-4.jpg';
import avatar5 from './assets/avatar-5.jpg';
import avatar6 from './assets/avatar-6.jpg';
import avatar7 from './assets/avatar-7.jpg';

export const tickerItems = [
  { symbol: 'XAU/USD', price: '2742.55', change: 1.09 },
  { symbol: 'XAG/USD', price: '33.724', change: 2.03 },
  { symbol: 'EUR/USD', price: '1.08426', change: 0.34 },
  { symbol: 'GBP/USD', price: '1.29845', change: -0.22 },
  { symbol: 'USD/JPY', price: '153.420', change: 0.52 },
  { symbol: 'US30 Cash', price: '43210.3', change: 0.41 },
  { symbol: 'US100 Cash', price: '20450.8', change: 1.32 },
  { symbol: 'GER40 Cash', price: '19520.4', change: -0.28 },
  { symbol: 'BTC/USD', price: '67840.48', change: 2.81 },
  { symbol: 'ETH/USD', price: '2542.81', change: 3.1 },
  { symbol: 'USOIL', price: '71.83', change: -1.09 },
];

export const heroStats = [
  { value: '0.0', label: 'Raw spreads (acct)' },
  { value: '1:500', label: 'Leverage (max)*' },
  { value: '<30ms', label: 'Typical order latency' },
  { value: '200+', label: 'Tradable symbols' },
];

export const instruments = [
  { title: 'Forex', text: '60+ currency pairs with institutional grade execution and liquidity.', image: 'forex' },
  { title: 'Stocks', text: 'Trade global giants like Apple, Tesla, and Meta with flexible leverage.', image: 'stocks' },
  { title: 'Indices', text: 'Speculate on NASDAQ, DAX, and S&P 500 — trade the pulse of global markets.', image: 'indices' },
  { title: 'Crypto', text: '24/7 access to Bitcoin, Ethereum, and other digital assets with no expiry.', image: 'crypto' },
];

export const marketCategories = [
  { title: 'Forex', text: 'Majors, minors, and exotics with deep liquidity across sessions.', pairs: 'EURUSD · GBPUSD · USDJPY', icon: 'swap', color: 'orange' },
  { title: 'Metals', text: 'Express macro views with Gold and Silver CFD exposure.', pairs: 'XAUUSD · XAGUSD', icon: 'medal', color: 'amber' },
  { title: 'Indices', text: 'Trade global equity indices with tight pricing and fast fills.', pairs: 'US30 · US100 · GER40', icon: 'trend', color: 'blue' },
  { title: 'Energies & Crypto', text: 'Capture momentum on WTI/Brent and leading crypto pairs.', pairs: 'USOIL · UKOIL · BTCUSD', icon: 'bolt', color: 'red' },
];

export const screenerRows = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Forex', bid: 1.08426, ask: 1.08427, spread: '0.6 pips', change: 0.34, dp: 5, range: [1.08, 1.09] },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'Forex', bid: 1.29845, ask: 1.29846, spread: '0.8 pips', change: -0.22, dp: 5, range: [1.3, 1.3] },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'Forex', bid: 153.42, ask: 153.421, spread: '0.8 pips', change: 0.52, dp: 3, range: [152.6, 153.85] },
  { symbol: 'AUD/USD', name: 'Australian Dollar / USD', category: 'Forex', bid: 0.65818, ask: 0.65819, spread: '0.8 pips', change: 0.2, dp: 5, range: [0.66, 0.66] },
  { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', category: 'Forex', bid: 199.216, ask: 199.218, spread: '1.5 pips', change: 0.7, dp: 3, range: [198.1, 199.7] },
  { symbol: 'XAU/USD', name: 'Spot Gold / US Dollar', category: 'Metals', bid: 2742.54, ask: 2742.55, spread: '1.5 pips', change: 1.05, dp: 2, range: [2728.1, 2758.4] },
  { symbol: 'XAG/USD', name: 'Spot Silver / US Dollar', category: 'Metals', bid: 33.724, ask: 33.725, spread: '1.5 pips', change: 2.03, dp: 3, range: [32.95, 34.12] },
  { symbol: 'US30 Cash', name: 'Dow Jones Industrial Average', category: 'Indices', bid: 43210.3, ask: 43210.5, spread: '2 pips', change: 0.41, dp: 1, range: [43050, 43380] },
  { symbol: 'US100 Cash', name: 'Nasdaq 100 Technology Index', category: 'Indices', bid: 20450.4, ask: 20450.5, spread: '1.2 pips', change: 1.28, dp: 1, range: [20280, 20540] },
  { symbol: 'GER40 Cash', name: 'German DAX Index', category: 'Indices', bid: 19520.2, ask: 19520.4, spread: '1.5 pips', change: -0.28, dp: 1, range: [19480, 19610] },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'Crypto', bid: 67840.48, ask: 67840.52, spread: '4.5 pips', change: 2.81, dp: 2, range: [65920, 68450] },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'Crypto', bid: 2542.81, ask: 2542.82, spread: '0.7 pips', change: 3.1, dp: 2, range: [2460, 2580] },
  { symbol: 'SOL/USD', name: 'Solana / US Dollar', category: 'Crypto', bid: 178.65, ask: 178.65, spread: '0.15 pips', change: 4.73, dp: 2, range: [170.1, 182.4] },
  { symbol: 'USOIL Spot', name: 'WTI Crude Oil', category: 'Energies', bid: 71.83, ask: 71.83, spread: '0.03 pips', change: -1.09, dp: 2, range: [71.4, 73.1] },
  { symbol: 'UKOIL Spot', name: 'Brent Crude Oil', category: 'Energies', bid: 75.38, ask: 75.38, spread: '0.03 pips', change: -0.96, dp: 2, range: [74.9, 76.6] },
];

export const screenerTabs = ['All Instruments', 'Forex Pairs', 'Precious Metals', 'Global Indices', 'Crypto CFDs', 'Energies'];

export const accounts = [
  {
    name: 'Standard Account',
    desc: 'All-inclusive pricing with zero commissions. Ideal for new & swing traders.',
    spreads: '1.0 Pips',
    commission: 'Zero ($0)',
    commissionGood: true,
    leverage: 'Up to 1:500',
    minDeposit: '$0',
    features: [
      'Zero commission on all asset classes',
      'No minimum deposit requirement',
      'Swap-free Islamic option available',
      'Full EA (Expert Advisor) support',
      'Negative balance protection',
      'Free multilingual live support',
    ],
    cta: 'Open Standard',
  },
  {
    name: 'Raw Spread',
    desc: 'Direct institutional liquidity with razor spreads from 0.0 pips. The ultimate scalper choice.',
    spreads: '0.0 Pips',
    commission: '$3.50 per lot/side',
    leverage: 'Up to 1:500',
    minDeposit: '$100',
    popular: true,
    features: [
      'Institutional raw spreads from 0.0 pips',
      'Deep liquidity from Tier-1 global banks',
      'Ideal for scalping, hedging & EAs',
      'Ultra-low order latency in Equinix LD4',
      'Zero markup on market depth',
      'Comprehensive level 2 market data',
    ],
    cta: 'Open Raw Spread',
  },
  {
    name: 'Pro Trader',
    desc: 'Discounted spreads and zero commissions tailored for high-volume active traders.',
    spreads: '0.5 Pips',
    commission: 'Zero ($0)',
    commissionGood: true,
    leverage: 'Up to 1:500',
    minDeposit: '$500',
    features: [
      'Low spreads with zero added commission',
      'Complimentary ultra-low latency VPS',
      'Priority withdrawal processing',
      'Daily institutional market analysis',
      'Free advanced TradingView indicator pack',
      'Personal account manager',
    ],
    cta: 'Open Pro Account',
  },
  {
    name: 'Institutional VIP',
    desc: 'Bespoke execution, customized liquidity pools, and dedicated senior dealer support.',
    spreads: '0.0 Pips',
    commission: 'Tiered VIP',
    leverage: 'Up to 1:500',
    minDeposit: '$10,000',
    features: [
      'Direct FIX 4.4 API protocol integration',
      'Custom liquidity aggregation profiles',
      'Dedicated 24/7 senior trading desk dealer',
      'Free high-spec cross-connected VPS',
      'Custom swap rates & rebate program',
      'Invitations to exclusive global VIP summits',
    ],
    cta: 'Apply for VIP',
  },
];

export const onboardingSteps = [
  { title: 'Create', text: 'Sign up securely and personalize your account preferences for a tailored trading setup.', cta: 'Get Started', image: 'create' },
  { title: 'Verify', text: 'Upload your KYC documents in minutes — identity and address checks are processed instantly.', cta: 'Verify Now', image: 'verify' },
  { title: 'Fund & Trade', text: 'Deposit funds using cards, e-wallets, or local bank transfers and start trading right away.', cta: 'View Funding Options', image: 'fund' },
];

export const reviewsTop = [
  { name: 'Michael Dlamini', role: 'Regional Introducing Broker (IB) · South Africa', badge: '420+ Active Clients', text: 'The partner dashboard is the most transparent I have used. Rebates land in real time and my referred clients keep praising the fast fills.', avatar: avatar1 },
  { name: 'James Walker', role: 'Crypto & FX Swing Trader · United Kingdom', badge: '99.4% Order Fill Rate', text: 'The WebTrader is excellent. Fast, secure, and synced in real time with my MT5 account, even on mobile.', avatar: avatar2 },
  { name: 'Amit Kumar', role: 'Quantitative Forex Scalper · United Arab Emirates', badge: '+142.8% Ann. Return', text: 'My automated scalp bots execute with virtually zero slippage, even across NFP and CPI spikes.', avatar: avatar3 },
  { name: 'Sophia Lindqvist', role: 'Full-Time Indices & Gold Trader · Sweden', badge: 'Same-Day Withdrawals', text: 'Deposits are instant and withdrawals hit my bank the same day. Execution on Gold has been consistently sharp.', avatar: avatar4 },
  { name: 'Liam Osei', role: 'Momentum Trader · Ghana', badge: '1:500 Leverage', text: 'Clear pricing, no hidden fees, and the support desk actually answers. Exactly what I needed to stay disciplined.', avatar: avatar5 },
];

export const reviewsBottom = [
  { name: 'Aisha Al-Mansoor', role: 'High-Frequency FX Trader · Qatar', badge: '0.0 Pip Raw Spreads', text: 'The zero markup raw spread account combined with instant VIP withdrawals has completely transformed our daily high-frequency trading operations.', avatar: avatar5 },
  { name: 'David Chen', role: 'Multi-Asset Portfolio Trader · Australia', badge: '1:500 Direct DMA', text: 'Execution slippage is virtually non-existent. Having true ECN liquidity on both crypto and standard forex pairs in one unified margin account is unbeatable.', avatar: avatar4 },
  { name: 'Elena Rostova', role: 'Algorithmic Fund Trader · Singapore', badge: 'Sub-15ms Latency', text: 'Direct cross-connect to LD4 Equinix makes all the difference for our latency arbitrage models. Spreads hold razor-sharp even through the Tokyo open.', avatar: avatar6 },
  { name: 'Carlos Mendoza', role: 'Prop Firm Manager · Mexico', badge: 'Institutional Execution', text: 'Majesty FX has eliminated the requote issues we had with other brokers. Truly unmatched for both forex and Spot Gold.', avatar: avatar7 },
];

export const faqs = [
  { q: 'How fast are deposits and withdrawals processed?', tag: 'Funding', a: 'Deposits via Crypto (USDT, BTC, ETH) and credit/debit cards are credited instantly to your trading balance. E-wallet and bank transfers take between 15 minutes and 2 hours. Withdrawals are processed by our automated treasury desk 24/7 and typically hit your destination within 1 to 24 hours.' },
  { q: 'What are Majesty FX Raw Spreads and how do they work?', tag: 'Trading', a: 'Raw Spread accounts pass interbank pricing through with little or no markup, and charge a fixed commission per lot per side instead. Spreads are variable and can widen during news or low-liquidity periods.' },
  { q: 'Which trading platforms can I trade on?', tag: 'Platforms', a: 'You can trade on MetaTrader 5 for desktop, web, iOS, and Android, on the browser-based WebTrader (no installation), and on the Majesty FX mobile app.' },
  { q: 'Can I test my strategy with a free Demo Account?', tag: 'Accounts', a: 'Yes. Every new user can open a demo account with virtual funds to test strategies, EAs, and the full platform before going live.' },
  { q: 'How are my deposited funds safeguarded?', tag: 'Security', a: 'Client funds are held in fully segregated custodial accounts at Tier-1 banking institutions, kept separate from company operating capital. All data is protected with 256-bit SSL encryption.' },
  { q: 'What leverage is available and can I adjust it?', tag: 'Trading', a: 'Leverage is available up to 1:500 depending on the account type and instrument. You can adjust leverage in your account settings, subject to margin requirements.' },
  { q: 'How does the Majesty FX Introducing Broker (IB) program work?', tag: 'Partners', a: 'IBs earn rebates on the volume their referred clients trade. Rebates are tracked in real time on the partner dashboard and paid out on a regular schedule.' },
  { q: 'What documents are required to verify my trading account?', tag: 'Accounts', a: 'You will need a government-issued photo ID (passport, national ID, or driver’s licence) and a recent proof of address, such as a utility bill or bank statement dated within the last three months.' },
  { q: 'Can I fund and withdraw using cryptocurrencies?', tag: 'Funding', a: 'Yes. USDT, BTC, and ETH are supported for both funding and withdrawals, subject to network confirmation times.' },
  { q: 'Are swap-free Islamic trading accounts available?', tag: 'Trading', a: 'Yes. Swap-free Islamic accounts are available on the Standard Account, with no overnight swap charges on eligible positions.' },
];

export const footerColumns = [
  { title: 'Products', links: ['Forex Currencies', 'Precious Metals', 'Stock Indices', 'Cryptocurrency CFDs', 'Contract Specifications'] },
  { title: 'Accounts & Spreads', links: ['Account Types Comparison', 'Pricing & Raw Spreads', 'Trading Conditions', 'Trader Tools & Analytics', 'Free Demo Account'] },
  { title: 'Support & Help', links: ['Help Center & FAQ', 'Customer Support Desk', 'MetaTrader 5 (MT5)', 'WebTrader Browser', 'Partners (IB Program)'] },
  { title: 'Company & Legal', links: ['About Majesty FX', 'Terms & Conditions', 'Privacy Policy', 'Risk Disclosure', 'AML & Compliance Policy'] },
];

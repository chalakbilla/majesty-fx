# Majesty FX — Institutional Trading Platform & Admin Console

A high-performance trading platform frontend built with **React**, **Vite**, and **Tailwind CSS**. It includes a modern retail trading landing platform and an institutional-grade administrative suite with reactive client management, multi-desk routing, operational queues, and 24 live KPI metrics.

---

## High-Level Architecture & Structure

```mermaid
flowchart TD
    App["Majesty FX Platform (React + Vite)"]

    App --> Public["Public Trading Portal (/)"]
    App --> Auth["Authentication (/auth/*)"]
    App --> Admin["Admin Command Center (/admin/*)"]

    Public --> P1["Live Market Screener & Ticker"]
    Public --> P2["MT5, WebTrader & Mobile Platforms"]
    Public --> P3["Interactive Margin & PnL Calculator"]

    Auth --> A1["Trader Login & Registration"]
    Auth --> A2["Password Recovery & Verification"]

    Admin --> M1["Live Multi-Desk Dashboard"]
    Admin --> M2["Client Manager (Referral, IB1, IB2)"]
    Admin --> M3["Treasury (Deposits & Withdrawals)"]
    Admin --> M4["Compliance (KYC Verification)"]
    Admin --> M5["PAMM & Copy Trading Networks"]
```

---

## Directory Structure

```
Majesty fx/
├── public/                       # Static public assets (favicons, icons)
├── src/
│   ├── assets/                   # Market images, platform graphics & logos
│   ├── components/               # Reusable UI component modules
│   │   ├── admin/                # Admin layout, protection, tables, and dialogs
│   │   │   ├── AdminLayout.jsx   # Responsive sidebar & navigation shell
│   │   │   ├── AdminProtected.jsx# Route protection & session guard
│   │   │   ├── ConfirmDialog.jsx # Reusable action confirmation modal
│   │   │   ├── RowActions.jsx    # Table inline action buttons (edit/delete)
│   │   │   └── TablePager.jsx    # Standard table pagination & row counter
│   │   ├── route/                # Authentication layout & language switcher
│   │   ├── Hero.jsx              # Landing hero banner with phone mockup
│   │   ├── Instruments.jsx       # Real-time multi-asset market screener
│   │   ├── Accounts.jsx          # Account tier cards & interactive calculator
│   │   ├── Platforms.jsx         # MetaTrader 5, WebTrader & mobile showcase
│   │   └── Reviews.jsx           # High-speed bidirectional review marquees
│   ├── data/
│   │   ├── json/                 # 50+ JSON seed datasets for admin collections
│   │   ├── collections.js        # Registry of all reactive database collections
│   │   └── data.js               # Static content, pricing feeds & navigation links
│   ├── hooks/
│   │   ├── useCollection.js      # Reactive CRUD hook with cross-tab persistence
│   │   └── useTableControls.js   # Search, filter, sorting & pagination controller
│   ├── pages/
│   │   ├── admin/                # 50+ dedicated institutional admin pages
│   │   │   ├── AdminDemo.jsx     # Master /admin dashboard (KPIs & queues)
│   │   │   ├── AdminClients.jsx  # Client manager with modals & floating actions
│   │   │   ├── AdminKYCDocuments.jsx # KYC identity verification portal
│   │   │   ├── AdminDepositHistory.jsx # Deposit ledger & review
│   │   │   └── AdminWithdrawHistory.jsx# Withdrawal payout processing
│   │   └── ...                   # Public routes & authentication screens
│   ├── services/
│   │   └── mockDb.js             # Reactive in-memory DB backed by localStorage
│   ├── styles/
│   │   ├── admin.css             # Institutional admin styles & KPI card tokens
│   │   └── index.css             # Base Tailwind directives & typography
│   ├── utils/
│   │   ├── adminAuth.js          # Admin credentials & session management
│   │   └── dashboardMetrics.js   # Real-time math engine for 24 KPI metrics
│   ├── App.jsx                   # Master routing table & layout composition
│   └── main.jsx                  # React application entry point
├── package.json                  # NPM dependencies & build scripts
├── tailwind.config.js            # Tailwind typography, theme & color palette
├── vite.config.js                # Vite bundler plugins & dev server config
└── README.md                     # Project documentation
```

---

## Operational Workflows

### 1. Deposit & Payout Queue Workflow

The operational queue flags all incoming transactions requiring administrative compliance approval, treasury release, or KYC document verification:

```mermaid
flowchart LR
    Queue["Operational Requests Queue"]

    Queue --> Dep["Pending Deposits"]
    Queue --> Wd["Pending Withdrawals"]
    Queue --> Kyc["Pending KYC Docs"]

    Dep --> DepAct{"Compliance Review"}
    DepAct -- "Approve" --> DepApp["Deposit Approved
Balance Credited"]
    DepAct -- "Reject" --> DepRej["Deposit Declined
Logged to Records"]

    Wd --> WdAct{"Treasury Review"}
    WdAct -- "Approve" --> WdApp["Payout Released
Withdrawal Complete"]
    WdAct -- "Reject" --> WdRej["Payout Declined
Funds Returned"]

    Kyc --> KycAct{"Identity Review"}
    KycAct -- "Verify" --> KycApp["Account Verified
Limits Unlocked"]
    KycAct -- "Decline" --> KycRej["KYC Rejected
Resubmit Prompted"]
```

---

### 2. Multi-Desk Architecture

The administrative portal supports four isolated execution desks, each configured with dedicated MT5 gateway mappings, client routing rules, and color badges:

```mermaid
flowchart TD
    Console["Admin Console (/admin)"]

    Console --> Referral["Referral Desk
Retail & Direct Traders
Gateway: MajestyFX-Trade"]
    Console --> IB1["Partner 001 Desk
Institutional IB Network 1
Gateway: MajestyFX-Trade"]
    Console --> IB2["Partner 002 Desk
Institutional IB Network 2
Gateway: TheKFMarket-Live"]
    Console --> Super["Super Admin Master Console
Consolidated Institutional & Risk View"]
```

---

### 3. Reactive Data Flow Engine

All administrative interactions update instantly across screens without page reloads using a centralized reactive event bus and `localStorage` caching:

```mermaid
flowchart LR
    Seeds["Seed JSON Files
(src/data/json/*.json)"]
    Store["mockDb Storage Engine
(In-Memory + localStorage)"]
    Hook["useCollection() Hook
(Reactive Subscription)"]
    UI["Admin Tables & Views
(Instant UI Re-render)"]
    KPI["24 KPI Metrics Engine
(Live Aggregations)"]

    Seeds --> Store
    Store <--> Hook
    Hook --> UI
    Hook --> KPI
```

---

## Running the Project

### Prerequisites
- **Node.js** (v18.0 or higher recommended)
- **npm** (v9.0 or higher)

### Quick Start (Windows)
Double-click `launch.bat` in the root folder. It checks for Node.js, installs dependencies if needed, and starts the development server.

### Manual Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## Key Admin Features

| Feature | Description |
| :--- | :--- |
| **Operational Queue** | Top alert card indicating items requiring compliance or treasury action. |
| **24 KPI Cards** | Live metric calculations for deposits, withdrawals, equity, credit, clients, and trading accounts. |
| **Client Management** | Multi-tiered filtering (`Referral`, `IB1`, `IB2`, `Demo`), status toggling, and detail inspection modals. |
| **Treasury & Finance** | One-click deposit approval, payout processing, and internal transfer tracking. |
| **Compliance & KYC** | Secure proof-of-payment review and document identity verification. |
| **PAMM & Copy Trading** | Master accounts, follower allocations, and profit-sharing commission settlement. |

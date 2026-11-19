export const adminCredentials = [
  {
    id: 'admin_demo',
    email: 'demo@majestyfx.com',
    username: 'demoadmin',
    password: 'Demo@2026!',
    name: 'Demo Sandbox Admin',
    role: 'Super Admin',
    desk: 'demo',
    portal: 'Majesty FX Demo Sandbox Portal'
  }
];

export const initialPendingDeposits = [
  {
    id: 1,
    client: 'Sofia Al-Mansoor',
    email: 'sofia.mansoor@demo.example.com',
    server: '#800103',
    amount: '+$3,500.00',
    method: 'bank wire',
    txId: 'SWIFT-…0184',
    date: '17 Nov 2026 13:12',
    status: 'Pending',
    proof: '—'
  },
  {
    id: 2,
    client: 'David Miller',
    email: 'david.miller@demo.example.com',
    server: '#800105',
    amount: '+$2,500.00',
    method: 'credit card',
    txId: 'STRIPE…7429',
    date: '17 Nov 2026 10:12',
    status: 'Pending',
    proof: '—'
  }
];

export const initialPendingWithdrawals = [
  {
    id: 1,
    client: 'Alexander Wright',
    email: 'alex.wright@demo.example.com',
    server: '#800101',
    amount: '−$1,500.00',
    method: 'crypto usdt',
    payTo: 'TRX7xK…cD6e',
    comment: '—',
    date: '17 Nov 2026 14:12',
    status: 'Pending'
  },
  {
    id: 2,
    client: 'David Miller',
    email: 'david.miller@demo.example.com',
    server: '#800105',
    amount: '−$1,000.00',
    method: 'bank wire',
    payTo: '—',
    comment: '—',
    date: '17 Nov 2026 11:12',
    status: 'Pending'
  }
];

export const ibPartners = [
  {
    id: 1,
    name: 'Demo Partner (IB)',
    email: 'demoib@majestyfx.com',
    code: 'MJDEMO999',
    phone: '+971 50 998 8776',
    country: 'United Arab Emirates',
    joined: '11/17/2026',
    clientsCount: 12,
    volume: '240.00 Lots',
    totalCommission: '$2,400.00',
    balance: '$850.00',
    tier: 'demo IB',
    currentRank: 'Gold Partner',
    rebateRate: '$10.00 / Lot',
    status: 'active'
  },
  {
    id: 2,
    name: 'Alexander Wright',
    email: 'alex.wright@demo.example.com',
    code: 'MJALEX101',
    phone: '+44 7700 900222',
    country: 'United Kingdom',
    joined: '11/12/2026',
    clientsCount: 8,
    volume: '142.50 Lots',
    totalCommission: '$1,425.00',
    balance: '$425.00',
    tier: 'demo IB',
    currentRank: 'Gold Partner',
    rebateRate: '$10.00 / Lot',
    status: 'active'
  },
  {
    id: 3,
    name: 'Marcus Chen',
    email: 'marcus.chen@demo.example.com',
    code: 'MJMCH888',
    phone: '+65 6789 0123',
    country: 'Singapore',
    joined: '11/05/2026',
    clientsCount: 15,
    volume: '385.00 Lots',
    totalCommission: '$3,850.00',
    balance: '$1,200.00',
    tier: 'demo IB',
    currentRank: 'Platinum Partner',
    rebateRate: '$10.00 / Lot',
    status: 'active'
  }
];

export const ibClients = [
  {
    id: 'CL-8001',
    name: 'Sofia Al-Mansoor',
    email: 'sofia.mansoor@demo.example.com',
    partner: 'Demo Partner (IB)',
    partnerCode: 'MJDEMO999',
    account: '#800103',
    volume: '45.00 Lots',
    equity: '$14,250.00',
    registered: '17 Nov 2026',
    status: 'Active'
  },
  {
    id: 'CL-8002',
    name: 'David Miller',
    email: 'david.miller@demo.example.com',
    partner: 'Demo Partner (IB)',
    partnerCode: 'MJDEMO999',
    account: '#800105',
    volume: '28.50 Lots',
    equity: '$9,800.00',
    registered: '15 Nov 2026',
    status: 'Active'
  },
  {
    id: 'CL-8003',
    name: 'Elena Rostova',
    email: 'elena.rostova@demo.example.com',
    partner: 'Alexander Wright',
    partnerCode: 'MJALEX101',
    account: '#800107',
    volume: '62.00 Lots',
    equity: '$22,400.00',
    registered: '12 Nov 2026',
    status: 'Active'
  },
  {
    id: 'CL-8004',
    name: 'Tariq Hassan',
    email: 'tariq.hassan@demo.example.com',
    partner: 'Marcus Chen',
    partnerCode: 'MJMCH888',
    account: '#800109',
    volume: '110.00 Lots',
    equity: '$48,000.00',
    registered: '08 Nov 2026',
    status: 'Active'
  }
];

export const initialTradingAccounts = [
  {
    id: 1,
    accountNo: '800106',
    clientName: 'Demo Trader',
    email: 'democlient@majestyfx.com',
    server: 'MajestyFX-Demo',
    leverage: '1:500',
    balance: '$10,000.00',
    balanceNum: 10000.00,
    equity: '$10,000.00',
    floatingPl: '+$0.00',
    status: 'ACTIVE',
    mainPassword: 'DemoPassword123!',
    investorPassword: 'ReadDemo2026!'
  },
  {
    id: 2,
    accountNo: '800107',
    clientName: 'Demo Partner (IB)',
    email: 'demoib@majestyfx.com',
    server: 'MajestyFX-Demo',
    leverage: '1:200',
    balance: '$15,000.00',
    balanceNum: 15000.00,
    equity: '$15,000.00',
    floatingPl: '+$0.00',
    status: 'ACTIVE',
    mainPassword: 'DemoPassword123!',
    investorPassword: 'ReadDemo2026!'
  },
  {
    id: 3,
    accountNo: '800105',
    clientName: 'Elena Rostova',
    email: 'elena.rostova@demo.example.com',
    server: 'MajestyFX-Demo',
    leverage: '1:500',
    balance: '$3,250.00',
    balanceNum: 3250.00,
    equity: '$3,250.00',
    floatingPl: '+$0.00',
    status: 'ACTIVE',
    mainPassword: 'DemoPassword123!',
    investorPassword: 'ReadDemo2026!'
  },
  {
    id: 4,
    accountNo: '800103',
    clientName: 'Sofia Al-Mansoor',
    email: 'sofia.mansoor@demo.example.com',
    server: 'MajestyFX-Demo',
    leverage: '1:400',
    balance: '$5,800.00',
    balanceNum: 5800.00,
    equity: '$5,800.00',
    floatingPl: '+$0.00',
    status: 'ACTIVE',
    mainPassword: 'DemoPassword123!',
    investorPassword: 'ReadDemo2026!'
  },
  {
    id: 5,
    accountNo: '800102',
    clientName: 'Alexander Wright',
    email: 'alex.wright@demo.example.com',
    server: 'MajestyFX-Demo',
    leverage: '1:200',
    balance: '$5,000.00',
    balanceNum: 5000.00,
    equity: '$5,000.00',
    floatingPl: '+$0.00',
    status: 'ACTIVE',
    mainPassword: 'DemoPassword123!',
    investorPassword: 'ReadDemo2026!'
  },
  {
    id: 6,
    accountNo: '800101',
    clientName: 'Alexander Wright',
    email: 'alex.wright@demo.example.com',
    server: 'MajestyFX-Demo',
    leverage: '1:500',
    balance: '$7,450.00',
    balanceNum: 7450.00,
    equity: '$7,450.00',
    floatingPl: '+$0.00',
    status: 'ACTIVE',
    mainPassword: 'DemoPassword123!',
    investorPassword: 'ReadDemo2026!'
  },
  {
    id: 7,
    accountNo: '800104',
    clientName: 'Marcus Chen',
    email: 'marcus.chen@demo.example.com',
    server: 'MajestyFX-Demo',
    leverage: '1:100',
    balance: '$24,100.00',
    balanceNum: 24100.00,
    equity: '$24,100.00',
    floatingPl: '+$0.00',
    status: 'ACTIVE',
    mainPassword: 'DemoPassword123!',
    investorPassword: 'ReadDemo2026!'
  }
];

export const initialClients = [
  {
    id: 1,
    tradingAccounts: ['800106'],
    fullName: 'Demo Trader',
    email: 'democlient@majestyfx.com',
    portalTier: 'Standard',
    mt5Server: 'MajestyFX-Demo',
    mobile: '+1 (555) 019-2831',
    country: 'United States',
    kycStatus: 'Approved',
    password: '••••••••',
    emailKyc: 'Verified',
    cri: 'Low'
  },
  {
    id: 2,
    tradingAccounts: ['800107'],
    fullName: 'Demo Partner (IB)',
    email: 'demoib@majestyfx.com',
    portalTier: 'Master IB',
    mt5Server: 'MajestyFX-Demo',
    mobile: '+971 50 998 8776',
    country: 'United Arab Emirates',
    kycStatus: 'Approved',
    password: '••••••••',
    emailKyc: 'Verified',
    cri: 'Low'
  },
  {
    id: 3,
    tradingAccounts: ['800105'],
    fullName: 'Elena Rostova',
    email: 'elena.rostova@demo.example.com',
    portalTier: 'Standard',
    mt5Server: 'MajestyFX-Demo',
    mobile: '+49 151 23456789',
    country: 'Germany',
    kycStatus: 'Approved',
    password: '••••••••',
    emailKyc: 'Verified',
    cri: 'Low'
  },
  {
    id: 4,
    tradingAccounts: ['800103'],
    fullName: 'Sofia Al-Mansoor',
    email: 'sofia.mansoor@demo.example.com',
    portalTier: 'VIP Raw',
    mt5Server: 'MajestyFX-Demo',
    mobile: '+971 55 123 4567',
    country: 'United Arab Emirates',
    kycStatus: 'Approved',
    password: '••••••••',
    emailKyc: 'Verified',
    cri: 'Low'
  },
  {
    id: 5,
    tradingAccounts: ['800102'],
    fullName: 'Alexander Wright',
    email: 'alex.wright@demo.example.com',
    portalTier: 'Standard',
    mt5Server: 'MajestyFX-Demo',
    mobile: '+44 7700 900222',
    country: 'United Kingdom',
    kycStatus: 'Approved',
    password: '••••••••',
    emailKyc: 'Verified',
    cri: 'Low'
  },
  {
    id: 6,
    tradingAccounts: ['800101'],
    fullName: 'Alexander Wright',
    email: 'alex.wright@demo.example.com',
    portalTier: 'Pro Zero',
    mt5Server: 'MajestyFX-Demo',
    mobile: '+44 7700 900222',
    country: 'United Kingdom',
    kycStatus: 'Approved',
    password: '••••••••',
    emailKyc: 'Verified',
    cri: 'Low'
  },
  {
    id: 7,
    tradingAccounts: ['800104'],
    fullName: 'Marcus Chen',
    email: 'marcus.chen@demo.example.com',
    portalTier: 'VIP Raw',
    mt5Server: 'MajestyFX-Demo',
    mobile: '+65 6789 0123',
    country: 'Singapore',
    kycStatus: 'Approved',
    password: '••••••••',
    emailKyc: 'Verified',
    cri: 'Low'
  }
];

export const initialCommissionTiers = [
  {
    id: 'tier_1',
    level: 'Level 1 (Direct)',
    forex: '8.00',
    metals: '12.00',
    indices: '6.00',
    crypto: '10.00',
    isBase: true
  },
  {
    id: 'tier_2',
    level: 'Level 2 (Sub-IB)',
    forex: '3.00',
    metals: '5.00',
    indices: '2.50',
    crypto: '4.00',
    isBase: false
  }
];

export const initialRebateAccounts = [
  {
    id: 1,
    partnerName: 'Demo Partner (IB)',
    partnerEmail: 'demoib@majestyfx.com',
    referralCode: 'MJDEMO999',
    tier: 'demo',
    forex: '$6',
    metals: '$8',
    crypto: '$12',
    indices: '$4',
    clients: 12,
    volume: '240.00',
    totalRebate: '$2,400.00',
    status: 'approved'
  },
  {
    id: 2,
    partnerName: 'Alexander Wright',
    partnerEmail: 'alex.wright@demo.example.com',
    referralCode: 'MJDEMO1001',
    tier: 'demo',
    forex: '$6',
    metals: '$8',
    crypto: '$12',
    indices: '$4',
    clients: 8,
    volume: '142.50',
    totalRebate: '$1,425.00',
    status: 'approved'
  },
  {
    id: 3,
    partnerName: 'Marcus Chen',
    partnerEmail: 'marcus.chen@demo.example.com',
    referralCode: 'MJDEMO2002',
    tier: 'demo',
    forex: '$6',
    metals: '$8',
    crypto: '$12',
    indices: '$4',
    clients: 15,
    volume: '385.00',
    totalRebate: '$3,850.00',
    status: 'approved'
  }
];

export const commissionRates = [
  {
    id: 1,
    level: 'Base Level 1',
    forex: '4.00',
    metals: '6.00',
    indices: '2.50',
    crypto: '8.00',
    status: 'Active'
  },
  {
    id: 2,
    level: 'Level 2 Partner',
    forex: '6.00',
    metals: '8.00',
    indices: '3.50',
    crypto: '10.00',
    status: 'Active'
  },
  {
    id: 3,
    level: 'Master Affiliate',
    forex: '8.00',
    metals: '10.00',
    indices: '5.00',
    crypto: '12.00',
    status: 'Active'
  }
];

export const rankTiers = [
  {
    id: 'silver',
    name: 'Silver Partner',
    ibCount: 0,
    desc: 'Entry-level partner status assigned to every new IB by default.',
    minVolume: '0 Lots',
    minClients: '0 Clients',
    minTrades: '0 Trades',
    forexRebate: '$4.00/Lot',
    metalsRebate: '$6.00/Lot',
    subSplit: '10%',
    color: 'slate'
  },
  {
    id: 'gold',
    name: 'Gold Partner',
    ibCount: 2,
    desc: 'Achieved through consistent client referral flow and active lots.',
    minVolume: '50 Lots',
    minClients: '5 Clients',
    minTrades: '100 Trades',
    forexRebate: '$8.00/Lot',
    metalsRebate: '$10.00/Lot',
    subSplit: '15%',
    color: 'amber'
  },
  {
    id: 'platinum',
    name: 'Platinum Partner',
    ibCount: 1,
    desc: 'Tier for professional multi-tier IB operators and funds.',
    minVolume: '150 Lots',
    minClients: '15 Clients',
    minTrades: '300 Trades',
    forexRebate: '$10.00/Lot',
    metalsRebate: '$12.00/Lot',
    subSplit: '20%',
    color: 'blue'
  },
  {
    id: 'diamond',
    name: 'Diamond Partner',
    ibCount: 0,
    desc: 'High-volume institutional introducers with dedicated support.',
    minVolume: '400 Lots',
    minClients: '35 Clients',
    minTrades: '800 Trades',
    forexRebate: '$12.00/Lot',
    metalsRebate: '$15.00/Lot',
    subSplit: '25%',
    color: 'purple'
  },
  {
    id: 'vip',
    name: 'VIP Partner',
    ibCount: 0,
    desc: 'Executive bespoke tier with customized rebate payout contracts.',
    minVolume: '1000 Lots',
    minClients: '75 Clients',
    minTrades: '2000 Trades',
    forexRebate: '$15.00/Lot',
    metalsRebate: '$20.00/Lot',
    subSplit: '30%',
    color: 'emerald'
  }
];

import { Tile } from '../types/game';

export const BOARD_TILES: Tile[] = [
  // 0: START (Corner 0)
  {
    id: 0,
    name: 'START GATEWAY',
    category: 'start',
    description: 'Collect your base salary stipend ($150) and all property dividend incomes as you pass!',
    iconName: 'Flag',
    color: 'emerald',
  },
  // 1: Earning
  {
    id: 1,
    name: 'FIRST JOB OFFICE',
    category: 'job',
    description: 'Calculate hourly wages, overtime pay, and weekly paychecks.',
    topic: 'earning',
    iconName: 'Briefcase',
    color: 'blue',
  },
  // 2: Buying & Selling
  {
    id: 2,
    name: 'MARKET SQUARE',
    category: 'shop',
    description: 'Solve profit and loss problems for market vendors.',
    topic: 'profit_loss',
    iconName: 'ShoppingBag',
    color: 'amber',
  },
  // 3: Property 1 - Coffee Shop
  {
    id: 3,
    name: 'COFFEE ROASTERS',
    category: 'property',
    description: 'Commercial Property: Artisan Coffee Roasters. Purchase or upgrade for passive income.',
    propertyId: 'coffee_shop',
    topic: 'earning',
    iconName: 'Coffee',
    color: 'amber',
  },
  // 4: Bank / Interest
  {
    id: 4,
    name: 'COMMUNITY BANK',
    category: 'bank',
    description: 'Calculate simple interest on savings accounts and short-term loans.',
    topic: 'interest',
    iconName: 'Landmark',
    color: 'indigo',
  },
  // 5: Event
  {
    id: 5,
    name: 'LUCKY EVENT',
    category: 'event',
    description: 'Unexpected financial windfalls or economic adjustments. Calculate your gains!',
    topic: 'financial_reasoning',
    iconName: 'Sparkles',
    color: 'purple',
  },
  // 6: Property 2 - Bookstore
  {
    id: 6,
    name: 'SCHOLAR BOOKSTORE',
    category: 'property',
    description: 'Commercial Property: The Scholar Bookstore. Steady profits on textbooks and fiction.',
    propertyId: 'book_store',
    topic: 'profit_loss',
    iconName: 'BookOpen',
    color: 'blue',
  },
  // 7: Corner 1 - Tax Office
  {
    id: 7,
    name: 'CENTRAL TAX BUREAU',
    category: 'tax',
    description: 'Calculate income tax, gross income, deductions, and net take-home salary.',
    topic: 'earning',
    iconName: 'Receipt',
    color: 'rose',
  },
  // 8: Shop / Discount
  {
    id: 8,
    name: 'SHOPPING ARCADE',
    category: 'shop',
    description: 'Seasonal discounts, percentage off stickers, and sale price calculations.',
    topic: 'discount',
    iconName: 'Percent',
    color: 'teal',
  },
  // 9: Borrowing
  {
    id: 9,
    name: 'CREDIT UNION',
    category: 'bank',
    description: 'Evaluate loan conditions, repayment schedules, and interest rates.',
    topic: 'borrowing',
    iconName: 'CreditCard',
    color: 'indigo',
  },
  // 10: Property 3 - Mini Market
  {
    id: 10,
    name: 'CITY FRESH MARKET',
    category: 'property',
    description: 'Commercial Property: City Fresh Mini Market. Fast inventory turnover and discounts.',
    propertyId: 'mini_market',
    topic: 'discount',
    iconName: 'Store',
    color: 'emerald',
  },
  // 11: Financial Advisor
  {
    id: 11,
    name: 'FINANCIAL ADVISOR',
    category: 'advisor',
    description: 'Compare financial packages: Bank A vs Bank B, simple vs compound schemes.',
    topic: 'financial_reasoning',
    iconName: 'Scale',
    color: 'cyan',
  },
  // 12: Earning Overtime
  {
    id: 12,
    name: 'LOGISTICS DEPOT',
    category: 'job',
    description: 'Time-and-a-half, double time rates, and shift allowances.',
    topic: 'earning',
    iconName: 'Clock',
    color: 'blue',
  },
  // 13: Property 4 - Tech Store
  {
    id: 13,
    name: 'BYTETECH STORE',
    category: 'property',
    description: 'Commercial Property: ByteTech Electronics. High-ticket items and warranty sales.',
    propertyId: 'tech_store',
    topic: 'discount',
    iconName: 'Laptop',
    color: 'cyan',
  },
  // 14: Corner 2 - Challenge Arena
  {
    id: 14,
    name: 'CHALLENGE ARENA',
    category: 'challenge',
    description: 'High-stakes multi-step financial problems with substantial XP and cash rewards!',
    topic: 'financial_reasoning',
    iconName: 'Flame',
    color: 'amber',
  },
  // 15: Investment
  {
    id: 15,
    name: 'INVESTMENT HUB',
    category: 'bank',
    description: 'Compound interest growth, annual compounding yields, and future balance forecasts.',
    topic: 'investing',
    iconName: 'TrendingUp',
    color: 'emerald',
  },
  // 16: Buying & Selling
  {
    id: 16,
    name: 'WHOLESALE BAZAAR',
    category: 'shop',
    description: 'Cost price, markups, percentage profit margins, and clearance losses.',
    topic: 'profit_loss',
    iconName: 'Package',
    color: 'amber',
  },
  // 17: Property 5 - Sports Centre
  {
    id: 17,
    name: 'APEX SPORTS CENTRE',
    category: 'property',
    description: 'Commercial Property: Apex Fitness & Sports. Recurring subscriptions & class fees.',
    propertyId: 'sports_centre',
    topic: 'earning',
    iconName: 'Activity',
    color: 'rose',
  },
  // 18: Bonus
  {
    id: 18,
    name: 'PERFORMANCE BONUS',
    category: 'event',
    description: 'Annual corporate bonus! Calculate percentage bonuses on salary.',
    topic: 'earning',
    iconName: 'Award',
    color: 'emerald',
  },
  // 19: Bank / Savings
  {
    id: 19,
    name: 'FEDERAL SAVINGS',
    category: 'bank',
    description: 'Term deposits, guaranteed returns, and multi-year simple interest calculations.',
    topic: 'interest',
    iconName: 'ShieldCheck',
    color: 'indigo',
  },
  // 20: Property 6 - Innovation Lab
  {
    id: 20,
    name: 'INNOVATION LAB',
    category: 'property',
    description: 'Commercial Property: Quantum Innovation Lab. Tech patents & high returns.',
    propertyId: 'innovation_lab',
    topic: 'investing',
    iconName: 'Zap',
    color: 'purple',
  },
  // 21: Corner 3 - Business District
  {
    id: 21,
    name: 'BUSINESS DISTRICT',
    category: 'job',
    description: 'Executive salaries, commission structures, and gross vs net profit comparisons.',
    topic: 'profit_loss',
    iconName: 'Building',
    color: 'blue',
  },
  // 22: Discount & Offers
  {
    id: 22,
    name: 'CLEARANCE OUTLET',
    category: 'shop',
    description: 'Special offers, multi-buy savings, and reverse discount calculations.',
    topic: 'discount',
    iconName: 'Tag',
    color: 'teal',
  },
  // 23: Event
  {
    id: 23,
    name: 'ECONOMIC SUMMIT',
    category: 'advisor',
    description: 'Analyze inflation and investment rate fluctuations. Make the optimal choice!',
    topic: 'financial_reasoning',
    iconName: 'Compass',
    color: 'cyan',
  },
  // 24: Property 7 - Office Tower
  {
    id: 24,
    name: 'COMMERCIAL TOWER',
    category: 'property',
    description: 'Commercial Property: Centennial Commercial Tower. Prime corporate tenancies.',
    propertyId: 'office_tower',
    topic: 'interest',
    iconName: 'Building2',
    color: 'indigo',
  },
  // 25: Borrowing
  {
    id: 25,
    name: 'MORTGAGE GUILD',
    category: 'bank',
    description: 'Home loans, interest over 5-10 years, and comparison of mortgage plans.',
    topic: 'borrowing',
    iconName: 'Key',
    color: 'indigo',
  },
  // 26: Challenge
  {
    id: 26,
    name: 'FINANCIAL GAUNTLET',
    category: 'challenge',
    description: 'Prove your mastery with advanced Cambridge IGCSE money problems!',
    topic: 'financial_reasoning',
    iconName: 'Trophy',
    color: 'amber',
  },
  // 27: Property 8 - Luxury Apartment
  {
    id: 27,
    name: 'SKYLINE PENTHOUSE',
    category: 'property',
    description: 'Commercial Property: Skyline Residence Penthouse. The ultimate luxury investment.',
    propertyId: 'luxury_apartment',
    topic: 'financial_reasoning',
    iconName: 'Home',
    color: 'amber',
  },
];

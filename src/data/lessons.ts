import { LessonContent } from '../types/game';

export const LESSONS: LessonContent[] = [
  {
    id: '17.1',
    chapterNumber: '17.1',
    title: 'Earning Money',
    subtopics: [
      {
        id: 'hourly_wages',
        title: 'Hourly Pay & Overtime Rates',
        concept: 'Gross pay earned based on working hours and overtime multipliers.',
        explanation: 'Basic pay is calculated by multiplying basic hourly rate by regular hours worked. When employees work overtime beyond normal contracted hours, they are paid at an enhanced rate such as time-and-a-half (1.5 × basic rate) or double time (2 × basic rate).',
        formula: 'Total Pay = (Basic Hours × Basic Rate) + (Overtime Hours × Overtime Rate)',
        workedExample: {
          question: 'Elena earns $14 per hour for a 35-hour week. She works 6 hours overtime at time-and-a-half. Calculate her total gross pay for the week.',
          steps: [
            'Step 1: Calculate basic pay = 35 hours × $14/hour = $490',
            'Step 2: Find the overtime rate = 1.5 × $14 = $21/hour',
            'Step 3: Calculate overtime pay = 6 hours × $21/hour = $126',
            'Step 4: Sum basic and overtime pay = $490 + $126 = $616',
          ],
          answer: '$616',
        },
        interactiveSimulatorType: 'wages',
        commonMistake: 'Multiplying overtime hours by the standard rate without applying the 1.5× or 2× multiplier, or forgetting to add basic pay to overtime pay.',
        quickCheck: {
          question: 'Marcus works 40 regular hours at $16/hour and 4 overtime hours at double time. What is his total gross pay?',
          options: ['$704', '$768', '$800', '$640'],
          correctIndex: 1, // 40*16 = 640. 4 * 32 = 128. 640 + 128 = 768
          explanation: 'Basic: 40 × $16 = $640. Overtime rate: 2 × $16 = $32/h. Overtime pay: 4 × $32 = $128. Total: $640 + $128 = $768.',
        },
      },
      {
        id: 'gross_net_deductions',
        title: 'Gross Income, Deductions & Net Income',
        concept: 'The difference between what you earn on paper and the net amount you take home.',
        explanation: 'Gross Income is total earnings before any reductions. Deductions include mandatory payments like income tax, pension contributions, and national insurance. Net Income is the actual take-home money remaining after all deductions.',
        formula: 'Net Income = Gross Income - Total Deductions',
        workedExample: {
          question: 'Sam receives an annual gross salary of $36,000. He pays 15% income tax and $150 per month into his pension fund. Calculate his monthly net income.',
          steps: [
            'Step 1: Find monthly gross salary = $36,000 ÷ 12 = $3,000',
            'Step 2: Calculate monthly tax = 15% of $3,000 = 0.15 × 3,000 = $450',
            'Step 3: Sum all monthly deductions = $450 (tax) + $150 (pension) = $600',
            'Step 4: Calculate monthly net income = $3,000 - $600 = $2,400',
          ],
          answer: '$2,400 per month',
        },
        commonMistake: 'Mixing up annual and monthly figures (e.g. subtracting an annual tax amount from a single month\'s gross earnings). Always convert all quantities to the same time period first!',
        quickCheck: {
          question: 'If a gross monthly wage is $2,800 and total statutory deductions equal 20%, what is the net pay?',
          options: ['$560', '$2,240', '$2,300', '$2,140'],
          correctIndex: 1,
          explanation: 'Deductions: 20% of 2,800 = $560. Net pay: 2,800 - 560 = $2,240 (or 80% of 2,800 = $2,240).',
        },
      },
    ],
  },
  {
    id: '17.2',
    chapterNumber: '17.2',
    title: 'Borrowing and Investing',
    subtopics: [
      {
        id: 'simple_interest',
        title: 'Simple Interest (PRT / 100)',
        concept: 'Interest calculated solely on the original principal sum for the entire period.',
        explanation: 'In simple interest, the money earned (or charged) stays constant each year because it is computed only against the starting principal, not accumulated interest.',
        formula: 'Interest: I = (P × R × T) / 100\nTotal Amount: A = P + I',
        workedExample: {
          question: 'Kiran invests $4,000 for 3 years in a savings account paying 4.5% simple interest per annum. Calculate the total interest earned and the final balance.',
          steps: [
            'Step 1: Identify variables: P = 4000, R = 4.5, T = 3',
            'Step 2: Calculate Interest: I = (4000 × 4.5 × 3) / 100',
            'Step 3: I = (54000) / 100 = $540',
            'Step 4: Total Amount: A = P + I = 4000 + 540 = $4,540',
          ],
          answer: 'Interest: $540, Total Amount: $4,540',
        },
        interactiveSimulatorType: 'interest',
        commonMistake: 'Failing to read whether the question asks for the "interest earned" ($540) or the "total amount at the end" ($4,540). Always check the exact word requested!',
        quickCheck: {
          question: 'Find the simple interest earned on $1,500 invested at 6% per annum for 4 years.',
          options: ['$360', '$1,860', '$90', '$240'],
          correctIndex: 0,
          explanation: 'I = (1500 × 6 × 4) / 100 = 36,000 / 100 = $360.',
        },
      },
      {
        id: 'compound_interest',
        title: 'Compound Interest Formula',
        concept: 'Interest earned on both the original principal and accumulated interest over successive periods.',
        explanation: 'Compound interest accelerates growth because at the end of each period, the interest is added to the principal to form the new base for subsequent calculations.',
        formula: 'Total Amount: A = P × (1 + R/100)^n\nCompound Interest: CI = A - P',
        workedExample: {
          question: 'Aisha deposits $2,500 in a fixed bond yielding 5% compound interest per year for 3 years. Calculate the final balance and the total interest earned to 2 decimal places.',
          steps: [
            'Step 1: Formula A = 2500 × (1 + 5/100)³ = 2500 × (1.05)³',
            'Step 2: Calculate multiplier: 1.05³ = 1.157625',
            'Step 3: A = 2500 × 1.157625 = $2,894.0625 ≈ $2,894.06',
            'Step 4: Interest CI = $2,894.06 - $2,500 = $394.06',
          ],
          answer: 'Total: $2,894.06, Interest: $394.06',
        },
        interactiveSimulatorType: 'interest',
        commonMistake: 'Multiplying by n instead of raising to the power of n, or forgetting that the formula directly gives the TOTAL amount A, not just the interest.',
        quickCheck: {
          question: 'An amount of $1,000 is invested at 10% compound interest per annum for 2 years. What is the total final amount?',
          options: ['$1,200', '$1,210', '$1,100', '$1,220'],
          correctIndex: 1,
          explanation: 'Year 1: 1,000 × 1.10 = $1,100. Year 2: 1,100 × 1.10 = $1,210. (Or 1,000 × 1.10² = $1,210).',
        },
      },
    ],
  },
  {
    id: '17.3',
    chapterNumber: '17.3',
    title: 'Buying and Selling',
    subtopics: [
      {
        id: 'profit_and_loss',
        title: 'Profit, Loss and Percentage Margins',
        concept: 'Measuring commercial gain or loss relative to the original cost price.',
        explanation: 'When Selling Price > Cost Price, you make a Profit. When Selling Price < Cost Price, you suffer a Loss. Crucially in Cambridge IGCSE, percentage profit or loss is ALWAYS calculated as a percentage of the COST PRICE (never the selling price!).',
        formula: 'Profit = Selling Price - Cost Price\nPercentage Profit = (Profit / Cost Price) × 100%\nPercentage Loss = (Loss / Cost Price) × 100%',
        workedExample: {
          question: 'A trader buys a vintage camera for $160 and refurbishes it, then sells it for $216. Calculate his percentage profit.',
          steps: [
            'Step 1: Calculate profit = Selling Price - Cost Price = $216 - $160 = $56',
            'Step 2: Divide profit by original Cost Price = 56 ÷ 160 = 0.35',
            'Step 3: Multiply by 100% to get percentage = 0.35 × 100% = 35%',
          ],
          answer: '35% profit',
        },
        interactiveSimulatorType: 'profit',
        commonMistake: 'Dividing the profit by the selling price ($216) instead of the cost price ($160). Remember: base is always COST PRICE.',
        quickCheck: {
          question: 'A tablet bought for $200 is sold for $170. What is the percentage loss?',
          options: ['$30%', '15%', '17.6%', '20%'],
          correctIndex: 1,
          explanation: 'Loss = 200 - 170 = $30. Percentage loss = (30 / 200) × 100% = 15%.',
        },
      },
      {
        id: 'discounts_and_sales',
        title: 'Discounts and Sale Prices',
        concept: 'Percentage price reductions applied to marked or list prices.',
        explanation: 'A discount is an amount subtracted from the normal marked price. You can find the sale price either by calculating the discount and subtracting it, or by multiplying directly by the remaining percentage factor (e.g. 20% discount means paying 80%).',
        formula: 'Discount Amount = Marked Price × (Discount% / 100)\nSale Price = Marked Price × (1 - Discount% / 100)',
        workedExample: {
          question: 'A mountain bike normally costs $480. During a seasonal clearance, the store advertises a 15% discount. What is the sale price?',
          steps: [
            'Method 1: Discount = 15% of $480 = 0.15 × 480 = $72. Sale price = $480 - $72 = $408.',
            'Method 2 (Multiplier): Paying 100% - 15% = 85%. Sale price = 0.85 × $480 = $408.',
          ],
          answer: '$408',
        },
        interactiveSimulatorType: 'discount',
        commonMistake: 'Calculating the discount ($72) and writing it down as the sale price instead of subtracting it from the marked price.',
        quickCheck: {
          question: 'A leather jacket marked at $300 is reduced by 25%. What is the discounted price?',
          options: ['$75', '$225', '$250', '$240'],
          correctIndex: 1,
          explanation: '25% of 300 = $75. Sale price = 300 - 75 = $225 (or 0.75 × 300 = $225).',
        },
      },
      {
        id: 'reverse_percentages',
        title: 'Reverse Percentages (Finding Original Cost / Extended)',
        concept: 'Finding original cost price before a profit, loss, or discount was applied.',
        explanation: 'When given the selling price AFTER a percentage increase or decrease, you cannot just take that percentage of the selling price! You must represent the original cost as 100% and divide by the decimal multiplier.',
        formula: 'If sold at p% profit: Original Cost = Selling Price ÷ (1 + p/100)\nIf sold after d% discount: Original Price = Sale Price ÷ (1 - d/100)',
        workedExample: {
          question: 'A smart watch is sold for $230 at a 15% profit. Find the original cost price to the retailer.',
          steps: [
            'Step 1: Understand that Selling Price represents 100% + 15% = 115% of Cost Price.',
            'Step 2: 115% = 1.15 × Cost Price = $230',
            'Step 3: Cost Price = $230 ÷ 1.15',
            'Step 4: Cost Price = $200',
          ],
          answer: '$200',
        },
        commonMistake: 'Calculating 15% of $230 ($34.50) and subtracting it! That yields $195.50, which is INCORRECT. 15% of 200 is 30, so 200 + 30 = 230.',
        quickCheck: {
          question: 'A coat is sold for $180 after a 20% discount. What was the normal marked price?',
          options: ['$216', '$225', '$200', '$220'],
          correctIndex: 1,
          explanation: '$180 represents 80% (0.80) of marked price. Marked price = 180 ÷ 0.80 = $225. (Check: 20% of 225 = 45; 225 - 45 = 180).',
        },
      },
    ],
  },
];

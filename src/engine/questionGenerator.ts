import { GameDifficulty, Question, QuestionType, TopicId } from '../types/game';
import { cleanNumber } from './questionValidator';

// Helper random choice
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const CONTEXT_NAMES = ['Liam', 'Sophia', 'Noah', 'Amara', 'Mateo', 'Zara', 'Ethan', 'Chloe', 'Tariq', 'Maya'];
const ITEMS = ['bicycle', 'laptop', 'gaming console', 'mountain jacket', 'smart watch', 'camera', 'tablet', 'acoustic guitar'];

interface QuestionTemplate {
  id: string;
  topic: TopicId;
  subtopic: string;
  difficulty: 1 | 2 | 3 | 4;
  mode: GameDifficulty;
  questionType: QuestionType;
  generate: () => Question;
}

// -------------------------------------------------------------
// TEMPLATES COLLECTION
// -------------------------------------------------------------
const TEMPLATES: QuestionTemplate[] = [
  // ================= 17.1 EARNING MONEY =====================
  // Template: Basic Hourly Wages + Overtime (Core)
  {
    id: 'earn_overtime_core',
    topic: 'earning',
    subtopic: 'Hourly Wages & Overtime',
    difficulty: 1,
    mode: 'CORE',
    questionType: 'numerical',
    generate: () => {
      const name = pick(CONTEXT_NAMES);
      const rate = pick([12, 14, 15, 16, 18, 20]);
      const regularHours = 35;
      const overtimeHours = randInt(3, 8);
      const basicPay = regularHours * rate;
      const otRate = rate * 1.5;
      const otPay = overtimeHours * otRate;
      const totalPay = basicPay + otPay;

      const signature = `earn_ot_${rate}_${overtimeHours}_${regularHours}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'earning',
        subtopic: 'Hourly Wages & Overtime',
        difficulty: 1,
        mode: 'CORE',
        questionType: 'numerical',
        contextTitle: 'Weekly Paycheck Calculation',
        questionText: `${name} works 35 basic hours at $${rate} per hour. During a busy week, ${name} also works ${overtimeHours} hours of overtime paid at time-and-a-half (1.5 times the basic rate). Calculate ${name}'s total gross pay for the week.`,
        parameters: { name, rate, regularHours, overtimeHours },
        correctAnswer: totalPay,
        unit: '$',
        hint1: 'Calculate the basic pay first, then determine the overtime hourly rate by multiplying by 1.5.',
        hint2: `Basic pay = 35 × $${rate} = $${basicPay}. Overtime hourly rate = 1.5 × $${rate} = $${otRate}.`,
        solutionSteps: [
          `Basic pay = 35 hours × $${rate}/h = $${basicPay}`,
          `Overtime rate = $${rate} × 1.5 = $${otRate}/h`,
          `Overtime pay = ${overtimeHours} hours × $${otRate}/h = $${otPay}`,
          `Total gross pay = $${basicPay} + $${otPay} = $${totalPay}`,
        ],
        fullExplanation: `To find total pay, calculate basic earnings ($${basicPay}) and overtime earnings (${overtimeHours} × $${otRate} = $${otPay}), then add them to get $${totalPay}.`,
        xpReward: 25,
        moneyReward: 60,
      };
    },
  },

  // Template: Gross to Net Salary with percentage deductions (Core/Extended)
  {
    id: 'earn_gross_net_core',
    topic: 'earning',
    subtopic: 'Gross & Net Income',
    difficulty: 2,
    mode: 'CORE',
    questionType: 'multiple_choice',
    generate: () => {
      const name = pick(CONTEXT_NAMES);
      const grossMonthly = pick([2400, 2800, 3200, 3600, 4000]);
      const taxPercent = pick([10, 15, 20]);
      const pension = pick([120, 150, 180, 200]);
      const taxAmount = (grossMonthly * taxPercent) / 100;
      const totalDeductions = taxAmount + pension;
      const netPay = grossMonthly - totalDeductions;

      // Distractors
      const d1 = grossMonthly - taxAmount; // forgot pension
      const d2 = grossMonthly - (pension * 2); 
      const d3 = netPay - 100;
      const options = shuffle([`$${netPay}`, `$${d1}`, `$${d2}`, `$${d3}`]);

      const signature = `earn_net_${grossMonthly}_${taxPercent}_${pension}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'earning',
        subtopic: 'Gross & Net Income',
        difficulty: 2,
        mode: 'CORE',
        questionType: 'multiple_choice',
        contextTitle: 'Monthly Net Take-Home Salary',
        questionText: `${name}'s gross monthly salary is $${grossMonthly.toLocaleString()}. Deductions include ${taxPercent}% income tax and a fixed pension contribution of $${pension} per month. What is ${name}'s net take-home salary?`,
        parameters: { name, grossMonthly, taxPercent, pension },
        options,
        correctAnswer: `$${netPay}`,
        acceptableAnswers: [netPay, `$${netPay}`],
        unit: '$',
        hint1: 'Net Income = Gross Income - Total Deductions. First find the dollar amount of the tax deduction.',
        hint2: `Tax = ${taxPercent}% of $${grossMonthly} = $${taxAmount}. Total deductions = $${taxAmount} + $${pension}.`,
        solutionSteps: [
          `Tax deduction = (${taxPercent} / 100) × $${grossMonthly} = $${taxAmount}`,
          `Total deductions = $${taxAmount} (tax) + $${pension} (pension) = $${totalDeductions}`,
          `Net salary = $${grossMonthly} - $${totalDeductions} = $${netPay}`,
        ],
        fullExplanation: `Subtract the total deductions of $${totalDeductions} ($${taxAmount} tax + $${pension} pension) from the gross salary of $${grossMonthly} to leave a net income of $${netPay}.`,
        xpReward: 35,
        moneyReward: 90,
      };
    },
  },

  // Template: Annual to Weekly / Hourly conversion with Bonus (Extended)
  {
    id: 'earn_annual_conversion_ext',
    topic: 'earning',
    subtopic: 'Annual Salary & Overtime Multipliers',
    difficulty: 3,
    mode: 'EXTENDED',
    questionType: 'numerical',
    generate: () => {
      const name = pick(CONTEXT_NAMES);
      const weeklyHours = 40;
      const baseHourlyRate = pick([20, 22, 25, 28, 30]);
      const weeksPerYear = 52;
      const baseAnnual = baseHourlyRate * weeklyHours * weeksPerYear;
      const bonusPercent = pick([5, 8, 10]);
      const bonus = (baseAnnual * bonusPercent) / 100;
      const totalAnnual = baseAnnual + bonus;

      const signature = `earn_annual_${baseHourlyRate}_${bonusPercent}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'earning',
        subtopic: 'Annual Salary & Bonus',
        difficulty: 3,
        mode: 'EXTENDED',
        questionType: 'numerical',
        contextTitle: 'Annual Package Analysis',
        questionText: `${name} is contracted for 40 hours per week at an hourly rate of $${baseHourlyRate} for 52 weeks a year. In addition, ${name} receives an annual performance bonus of ${bonusPercent}% of the base annual earnings. Calculate ${name}'s total earnings for the year.`,
        parameters: { name, baseHourlyRate, bonusPercent, weeksPerYear },
        correctAnswer: totalAnnual,
        unit: '$',
        hint1: 'First find the weekly pay, multiply by 52 to get the base annual salary, then add the bonus.',
        hint2: `Base annual = 40 × $${baseHourlyRate} × 52 = $${baseAnnual.toLocaleString()}. Calculate ${bonusPercent}% of this amount.`,
        solutionSteps: [
          `Weekly pay = 40 × $${baseHourlyRate} = $${40 * baseHourlyRate}`,
          `Base annual salary = $${40 * baseHourlyRate} × 52 = $${baseAnnual.toLocaleString()}`,
          `Bonus = ${bonusPercent}% of $${baseAnnual.toLocaleString()} = $${bonus.toLocaleString()}`,
          `Total earnings = $${baseAnnual.toLocaleString()} + $${bonus.toLocaleString()} = $${totalAnnual.toLocaleString()}`,
        ],
        fullExplanation: `Base salary for 52 weeks is $${baseAnnual.toLocaleString()}. Adding the ${bonusPercent}% bonus ($${bonus.toLocaleString()}) yields total annual earnings of $${totalAnnual.toLocaleString()}.`,
        xpReward: 50,
        moneyReward: 140,
      };
    },
  },

  // ================= 17.2 BORROWING AND INVESTING =====================
  // Template: Simple Interest calculation (Core)
  {
    id: 'interest_simple_core',
    topic: 'interest',
    subtopic: 'Simple Interest',
    difficulty: 1,
    mode: 'CORE',
    questionType: 'numerical',
    generate: () => {
      const principal = pick([1000, 1500, 2000, 2500, 3000, 4000, 5000]);
      const rate = pick([3, 4, 5, 6, 7]);
      const years = pick([2, 3, 4, 5]);
      const interest = (principal * rate * years) / 100;
      const totalAmount = principal + interest;
      const asksForTotal = Math.random() > 0.5;

      const signature = `interest_sim_${principal}_${rate}_${years}_${asksForTotal ? 'A' : 'I'}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'interest',
        subtopic: 'Simple Interest',
        difficulty: 1,
        mode: 'CORE',
        questionType: 'numerical',
        contextTitle: 'Savings Bank Account',
        questionText: asksForTotal
          ? `An investor deposits $${principal.toLocaleString()} into a savings account earning ${rate}% simple interest per year for ${years} years. Calculate the TOTAL amount in the account at the end of the ${years} years.`
          : `An investor deposits $${principal.toLocaleString()} into a savings account earning ${rate}% simple interest per year for ${years} years. Calculate the total INTEREST earned.`,
        parameters: { principal, rate, years, asksForTotal },
        correctAnswer: asksForTotal ? totalAmount : interest,
        unit: '$',
        hint1: 'Use the Simple Interest formula: I = (P × R × T) / 100. Read carefully whether the question asks for Interest or Total Amount!',
        hint2: `I = (${principal} × ${rate} × ${years}) / 100 = $${interest}. ${asksForTotal ? 'Remember to add the principal to get the total amount!' : ''}`,
        solutionSteps: [
          `Identify P = $${principal}, R = ${rate}%, T = ${years} years`,
          `Calculate Interest: I = (${principal} × ${rate} × ${years}) / 100 = $${interest}`,
          ...(asksForTotal ? [`Calculate Total Amount: A = P + I = $${principal} + $${interest} = $${totalAmount}`] : []),
        ],
        fullExplanation: asksForTotal
          ? `The simple interest earned is $${interest}. Adding this to the original principal gives a total of $${totalAmount}.`
          : `Using I = (P × R × T) / 100, the interest earned over ${years} years is $${interest}.`,
        xpReward: 25,
        moneyReward: 60,
      };
    },
  },

  // Template: Finding Principal or Rate in Simple Interest (Core / Extended)
  {
    id: 'interest_find_rate_core',
    topic: 'borrowing',
    subtopic: 'Calculating Unknown Interest Rate',
    difficulty: 2,
    mode: 'CORE',
    questionType: 'numerical',
    generate: () => {
      const principal = pick([2000, 3000, 4000, 5000]);
      const rate = pick([4, 5, 6, 8]);
      const years = pick([2, 3, 4]);
      const interest = (principal * rate * years) / 100;

      const signature = `interest_rate_${principal}_${interest}_${years}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'borrowing',
        subtopic: 'Calculating Unknown Interest Rate',
        difficulty: 2,
        mode: 'CORE',
        questionType: 'numerical',
        contextTitle: 'Credit Union Loan Audit',
        questionText: `A loan of $${principal.toLocaleString()} accumulates $${interest.toLocaleString()} in simple interest over a period of ${years} years. What is the annual interest rate as a percentage?`,
        parameters: { principal, rate, years, interest },
        correctAnswer: rate,
        unit: '%',
        hint1: 'Rearrange the simple interest formula: R = (100 × I) / (P × T).',
        hint2: `R = (100 × ${interest}) / (${principal} × ${years}).`,
        solutionSteps: [
          `Formula: I = (P × R × T) / 100`,
          `Rearrange for R: R = (100 × I) / (P × T)`,
          `Substitute values: R = (100 × ${interest}) / (${principal} × ${years})`,
          `R = ${100 * interest} / ${principal * years} = ${rate}%`,
        ],
        fullExplanation: `Dividing the total interest by (Principal × Time) and multiplying by 100 reveals the annual rate of ${rate}%.`,
        xpReward: 35,
        moneyReward: 85,
      };
    },
  },

  // Template: Compound Interest (Extended)
  {
    id: 'interest_compound_ext',
    topic: 'investing',
    subtopic: 'Compound Interest Formula',
    difficulty: 3,
    mode: 'EXTENDED',
    questionType: 'numerical',
    generate: () => {
      const principal = pick([2000, 3000, 4000, 5000, 6000]);
      const rate = pick([4, 5, 6, 8]);
      const years = pick([2, 3]);
      
      const multiplier = Math.pow(1 + rate / 100, years);
      const totalAmount = cleanNumber(principal * multiplier);
      const compoundInterest = cleanNumber(totalAmount - principal);
      const asksForInterest = Math.random() > 0.5;

      const signature = `interest_comp_${principal}_${rate}_${years}_${asksForInterest ? 'CI' : 'A'}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'investing',
        subtopic: 'Compound Interest Formula',
        difficulty: 3,
        mode: 'EXTENDED',
        questionType: 'numerical',
        contextTitle: 'Compound Investment Growth',
        questionText: asksForInterest
          ? `An investment of $${principal.toLocaleString()} is placed into a fixed-yield fund earning ${rate}% compound interest per annum for ${years} years. Calculate the total compound interest earned (give your answer to the nearest dollar or 2 decimal places).`
          : `An investment of $${principal.toLocaleString()} is placed into a fixed-yield fund earning ${rate}% compound interest per annum for ${years} years. Calculate the final total value of the investment (give your answer to the nearest dollar or 2 decimal places).`,
        parameters: { principal, rate, years, asksForInterest },
        correctAnswer: asksForInterest ? compoundInterest : totalAmount,
        acceptableAnswers: [
          asksForInterest ? compoundInterest : totalAmount,
          asksForInterest ? Math.round(compoundInterest) : Math.round(totalAmount),
        ],
        unit: '$',
        hint1: 'Use the compound interest formula: Total Amount A = P × (1 + R/100)ⁿ.',
        hint2: `A = ${principal} × (1 + ${rate}/100)^${years} = ${principal} × ${(1 + rate / 100).toFixed(2)}^${years}. ${asksForInterest ? 'Then subtract the principal to find the interest.' : ''}`,
        solutionSteps: [
          `Compound formula: A = P × (1 + R/100)ⁿ`,
          `Substitute values: A = ${principal} × (1 + ${rate / 100}) raised to power ${years}`,
          `A = ${principal} × ${(multiplier).toFixed(4)} = $${totalAmount}`,
          ...(asksForInterest ? [`Compound Interest = Total Amount - Principal = $${totalAmount} - $${principal} = $${compoundInterest}`] : []),
        ],
        fullExplanation: asksForInterest
          ? `The total compounded value after ${years} years is $${totalAmount}. Subtracting the initial principal gives $${compoundInterest} in compound interest.`
          : `Compounding at ${rate}% annually over ${years} years produces a final balance of $${totalAmount}.`,
        xpReward: 45,
        moneyReward: 120,
      };
    },
  },

  // Template: Comparing Financial Options (Extended)
  {
    id: 'interest_compare_options_ext',
    topic: 'financial_reasoning',
    subtopic: 'Comparative Investment Analysis',
    difficulty: 4,
    mode: 'EXTENDED',
    questionType: 'compare_options',
    generate: () => {
      const principal = 4000;
      const years = 3;
      // Option A: Simple Interest at 6%
      const rateA = 6;
      const interestA = (principal * rateA * years) / 100; // 4000 * 0.18 = 720

      // Option B: Compound Interest at 5%
      const rateB = 5;
      const totalB = cleanNumber(principal * Math.pow(1.05, 3)); // 4000 * 1.157625 = 4630.50
      const interestB = cleanNumber(totalB - principal); // 630.50

      const diff = cleanNumber(interestA - interestB); // 720 - 630.50 = 89.50

      const options = shuffle([
        `Plan A yields $${diff.toFixed(2)} more`,
        `Plan B yields $${diff.toFixed(2)} more`,
        `Both plans yield identical returns`,
        `Plan A yields $120.00 more`,
      ]);

      const signature = `comp_opt_${principal}_${rateA}_${rateB}_${years}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'financial_reasoning',
        subtopic: 'Comparative Investment Analysis',
        difficulty: 4,
        mode: 'EXTENDED',
        questionType: 'compare_options',
        contextTitle: 'Financial Advisor Consultation',
        questionText: `An investor has $4,000 to invest for 3 years and must choose between two accounts:\n• Plan A: 6% Simple Interest per annum\n• Plan B: 5% Compound Interest per annum\nWhich plan yields more interest and by how much?`,
        parameters: { principal, rateA, rateB, years, diff },
        options,
        correctAnswer: `Plan A yields $${diff.toFixed(2)} more`,
        unit: '$',
        hint1: 'Calculate the total interest for Plan A using PRT/100, then calculate the total interest for Plan B using P(1+r/100)³ - P.',
        hint2: `Plan A interest = (4000 × 6 × 3)/100 = $720. Plan B balance = 4000 × (1.05)³ = $4,630.50 (Interest = $630.50).`,
        solutionSteps: [
          `Plan A interest = ($4,000 × 6 × 3) / 100 = $720.00`,
          `Plan B total = $4,000 × (1.05)³ = $4,630.50`,
          `Plan B interest = $4,630.50 - $4,000 = $630.50`,
          `Difference = $720.00 - $630.50 = $${diff.toFixed(2)} in favor of Plan A`,
        ],
        fullExplanation: `Plan A produces $720.00 in interest, whereas Plan B produces $630.50. Plan A therefore yields $${diff.toFixed(2)} more.`,
        xpReward: 60,
        moneyReward: 160,
      };
    },
  },

  // ================= 17.3 BUYING AND SELLING =====================
  // Template: Cost, Selling Price, Profit/Loss Percentage (Core)
  {
    id: 'profit_loss_calc_core',
    topic: 'profit_loss',
    subtopic: 'Percentage Profit and Loss',
    difficulty: 1,
    mode: 'CORE',
    questionType: 'numerical',
    generate: () => {
      const item = pick(ITEMS);
      const isProfit = Math.random() > 0.35;
      const cost = pick([50, 80, 100, 120, 150, 200, 250, 400]);
      const percent = pick([10, 15, 20, 25, 30, 40, 50]);
      
      const change = (cost * percent) / 100;
      const selling = isProfit ? cost + change : cost - change;

      const signature = `pl_calc_${cost}_${percent}_${isProfit ? 'P' : 'L'}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'profit_loss',
        subtopic: 'Percentage Profit and Loss',
        difficulty: 1,
        mode: 'CORE',
        questionType: 'numerical',
        contextTitle: 'Market Vendor Trade',
        questionText: isProfit
          ? `A merchant buys a ${item} for $${cost} and sells it for $${selling}. Calculate the percentage profit.`
          : `A merchant buys a ${item} for $${cost} and sells it at clearance for $${selling}. Calculate the percentage loss.`,
        parameters: { item, cost, selling, percent, isProfit },
        correctAnswer: percent,
        unit: '%',
        hint1: 'Percentage Profit/Loss is calculated by dividing the Profit or Loss by the original COST PRICE, then multiplying by 100%.',
        hint2: `${isProfit ? 'Profit' : 'Loss'} = |$${selling} - $${cost}| = $${change}. Divide $${change} by $${cost}.`,
        solutionSteps: [
          `${isProfit ? 'Profit' : 'Loss'} = |$${selling} - $${cost}| = $${change}`,
          `Formula: (${isProfit ? 'Profit' : 'Loss'} / Cost Price) × 100%`,
          `Calculation: ($${change} / $${cost}) × 100% = ${percent}%`,
        ],
        fullExplanation: `The merchant experienced a ${isProfit ? 'profit' : 'loss'} of $${change} on a base cost of $${cost}, which corresponds exactly to a ${percent}% ${isProfit ? 'profit' : 'loss'}.`,
        xpReward: 25,
        moneyReward: 60,
      };
    },
  },

  // Template: Discount and Sale Price (Core)
  {
    id: 'discount_sale_price_core',
    topic: 'discount',
    subtopic: 'Discounts & Marked Price',
    difficulty: 1,
    mode: 'CORE',
    questionType: 'numerical',
    generate: () => {
      const item = pick(ITEMS);
      const originalPrice = pick([80, 120, 150, 160, 200, 240, 300, 360, 450, 500]);
      const discountPercent = pick([10, 15, 20, 25, 30, 40]);
      const discountAmount = (originalPrice * discountPercent) / 100;
      const salePrice = originalPrice - discountAmount;

      const signature = `disc_sp_${originalPrice}_${discountPercent}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'discount',
        subtopic: 'Discounts & Marked Price',
        difficulty: 1,
        mode: 'CORE',
        questionType: 'numerical',
        contextTitle: 'Retail Store Promotion',
        questionText: `A ${item} originally priced at $${originalPrice} is on sale with a ${discountPercent}% discount. What is the sale price of the ${item}?`,
        parameters: { item, originalPrice, discountPercent },
        correctAnswer: salePrice,
        unit: '$',
        hint1: 'Calculate the dollar discount by finding the given percentage of the original price, then subtract it from the original price.',
        hint2: `Discount amount = ${discountPercent}% of $${originalPrice} = $${discountAmount}. Subtract this from $${originalPrice}.`,
        solutionSteps: [
          `Discount = (${discountPercent} / 100) × $${originalPrice} = $${discountAmount}`,
          `Sale Price = Original Price - Discount`,
          `Sale Price = $${originalPrice} - $${discountAmount} = $${salePrice}`,
        ],
        fullExplanation: `A ${discountPercent}% reduction on $${originalPrice} reduces the price by $${discountAmount}, leaving a final sale price of $${salePrice}.`,
        xpReward: 25,
        moneyReward: 65,
      };
    },
  },

  // Template: Reverse Percentage (Extended - finding original cost or marked price)
  {
    id: 'reverse_percentage_ext',
    topic: 'profit_loss',
    subtopic: 'Reverse Percentages',
    difficulty: 3,
    mode: 'EXTENDED',
    questionType: 'numerical',
    generate: () => {
      const item = pick(ITEMS);
      const originalCost = pick([120, 150, 180, 200, 250, 320, 400, 500]);
      const profitPercent = pick([10, 15, 20, 25, 30]);
      const sellingPrice = originalCost * (1 + profitPercent / 100);

      const signature = `rev_perc_${sellingPrice}_${profitPercent}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'profit_loss',
        subtopic: 'Reverse Percentages',
        difficulty: 3,
        mode: 'EXTENDED',
        questionType: 'numerical',
        contextTitle: 'Wholesale Trade Valuation',
        questionText: `A shop sells a ${item} for $${sellingPrice} making a ${profitPercent}% profit on the cost price. Calculate the original cost price of the ${item}.`,
        parameters: { item, originalCost, profitPercent, sellingPrice },
        correctAnswer: originalCost,
        unit: '$',
        hint1: 'Remember that the Selling Price represents (100% + profit%) = (100 + ' + profitPercent + ')% of the cost price. Do NOT just find ' + profitPercent + '% of $' + sellingPrice + '!',
        hint2: `1.${profitPercent < 10 ? '0' + profitPercent : profitPercent} × Cost Price = $${sellingPrice}. Divide $${sellingPrice} by ${(1 + profitPercent / 100).toFixed(2)}.`,
        solutionSteps: [
          `Selling Price represents 100% + ${profitPercent}% = ${100 + profitPercent}% of original cost`,
          `Multiplier = ${(1 + profitPercent / 100).toFixed(2)}`,
          `Cost Price = $${sellingPrice} ÷ ${(1 + profitPercent / 100).toFixed(2)} = $${originalCost}`,
        ],
        fullExplanation: `Dividing the selling price $${sellingPrice} by the growth multiplier ${(1 + profitPercent / 100).toFixed(2)} recovers the true original cost price of $${originalCost}.`,
        xpReward: 45,
        moneyReward: 130,
      };
    },
  },

  // Template: True / False Conceptual Questions
  {
    id: 'concept_true_false_core',
    topic: 'financial_reasoning',
    subtopic: 'Financial Fundamentals',
    difficulty: 1,
    mode: 'CORE',
    questionType: 'true_false',
    generate: () => {
      const concepts = [
        {
          statement: 'In Cambridge IGCSE, percentage profit is always calculated using the Cost Price as the denominator, not the Selling Price.',
          answer: 'True',
          explanation: 'Percentage profit = (Profit / Cost Price) × 100%. The base is always the initial cost incurred.',
        },
        {
          statement: 'Compound interest adds earned interest to the principal at each period, so the amount of interest earned grows each year.',
          answer: 'True',
          explanation: 'Unlike simple interest, compound interest recalculates interest based on the growing new balance.',
        },
        {
          statement: 'A 20% discount followed by another 20% discount on the new price is mathematically equivalent to a single 40% discount.',
          answer: 'False',
          explanation: 'Successive discounts multiply: paying 0.8 × 0.8 = 0.64 (a 36% discount overall, not 40%).',
        },
        {
          statement: 'Gross income is the take-home pay that an employee receives in their bank account after all deductions and taxes.',
          answer: 'False',
          explanation: 'Gross income is earnings BEFORE deductions. Net income is the take-home amount remaining after deductions.',
        },
      ];

      const item = pick(concepts);
      const signature = `tf_${item.statement.slice(0, 20)}`;

      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'financial_reasoning',
        subtopic: 'Financial Fundamentals',
        difficulty: 1,
        mode: 'CORE',
        questionType: 'true_false',
        contextTitle: 'Financial Principle Check',
        questionText: `State whether the following financial statement is True or False:\n\n"${item.statement}"`,
        parameters: { statement: item.statement },
        options: ['True', 'False'],
        correctAnswer: item.answer,
        hint1: 'Think carefully about the foundational financial formulas and definitions in Chapter 17.',
        hint2: item.answer === 'True' ? 'Consider whether the standard formula uses this definition.' : 'Test with a simple numerical example (e.g. $100).',
        solutionSteps: [
          `Evaluate the statement against IGCSE Chapter 17 criteria.`,
          `Conclusion: ${item.answer}.`,
        ],
        fullExplanation: item.explanation,
        xpReward: 20,
        moneyReward: 50,
      };
    },
  },

  // Template: Find the Error (Extended)
  {
    id: 'find_error_ext',
    topic: 'financial_reasoning',
    subtopic: 'Error Analysis in Working',
    difficulty: 3,
    mode: 'EXTENDED',
    questionType: 'find_error',
    generate: () => {
      const errors = [
        {
          problem: 'A jacket was sold for $180 after a 20% discount. Find the original price.',
          studentSteps: [
            'Step 1: Calculate 20% of $180 = 0.20 × 180 = $36',
            'Step 2: Add $36 to $180 = $180 + $36 = $216',
            'Step 3: State original price = $216',
          ],
          errorStep: 'Step 1',
          errorExplanation: 'The student took 20% of the sale price ($180) instead of recognizing that $180 represents 80% of the original price (Correct: $180 ÷ 0.80 = $225).',
        },
        {
          problem: 'Calculate the percentage profit on an item bought for $80 and sold for $100.',
          studentSteps: [
            'Step 1: Profit = $100 - $80 = $20',
            'Step 2: Percentage profit = ($20 / $100) × 100%',
            'Step 3: Percentage profit = 20%',
          ],
          errorStep: 'Step 2',
          errorExplanation: 'The student divided by the selling price ($100) instead of the cost price ($80). The correct formula is (Profit / Cost Price) × 100% = (20/80) × 100% = 25%.',
        },
      ];

      const item = pick(errors);
      const options = ['Step 1', 'Step 2', 'Step 3', 'No error in working'];

      const signature = `error_${item.problem.slice(0, 15)}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'financial_reasoning',
        subtopic: 'Error Analysis in Working',
        difficulty: 3,
        mode: 'EXTENDED',
        questionType: 'find_error',
        contextTitle: 'Peer Work Review',
        questionText: `A student attempted the following problem:\n"${item.problem}"\n\nStudent's Working:\n${item.studentSteps.join('\n')}\n\nIn which step did the student make a mathematical error?`,
        parameters: { problem: item.problem },
        options,
        correctAnswer: item.errorStep,
        errorLocation: item.errorStep,
        hint1: 'Review the IGCSE rule for reverse percentages and base denominators.',
        hint2: `Check whether percentages were calculated from the right base value.`,
        solutionSteps: [
          `Analyze each step against mathematical rules.`,
          `Error occurs in ${item.errorStep}: ${item.errorExplanation}`,
        ],
        fullExplanation: item.errorExplanation,
        xpReward: 40,
        moneyReward: 110,
      };
    },
  },

  // Template: Multi-step Realistic Financial Problem (Extended)
  {
    id: 'multistep_business_ext',
    topic: 'profit_loss',
    subtopic: 'Multi-Step Commercial Problem',
    difficulty: 4,
    mode: 'EXTENDED',
    questionType: 'numerical',
    generate: () => {
      const quantity = pick([20, 25, 40, 50]);
      const costPerUnit = pick([10, 12, 15, 20]);
      const totalCost = quantity * costPerUnit;
      // Sells 80% at 50% profit, remainder at 20% discount off selling price
      const batchA_qty = Math.floor(quantity * 0.8);
      const batchB_qty = quantity - batchA_qty;
      const normalSelling = costPerUnit * 1.5;
      const discountedSelling = normalSelling * 0.8;

      const revenueA = batchA_qty * normalSelling;
      const revenueB = batchB_qty * discountedSelling;
      const totalRevenue = cleanNumber(revenueA + revenueB);
      const overallProfit = cleanNumber(totalRevenue - totalCost);

      const signature = `multi_biz_${quantity}_${costPerUnit}`;
      return {
        id: `q_${Date.now()}_${randInt(100, 999)}`,
        signature,
        topic: 'profit_loss',
        subtopic: 'Multi-Step Commercial Problem',
        difficulty: 4,
        mode: 'EXTENDED',
        questionType: 'numerical',
        contextTitle: 'Inventory Clearance Scenario',
        questionText: `A business purchases ${quantity} backpacks at a wholesale cost of $${costPerUnit} each.\n• It sells ${batchA_qty} backpacks at a 50% profit markup on cost.\n• It sells the remaining ${batchB_qty} backpacks at clearance with a 20% discount off the markup selling price.\nCalculate the total overall profit made on the entire batch of ${quantity} backpacks.`,
        parameters: { quantity, costPerUnit, batchA_qty, batchB_qty },
        correctAnswer: overallProfit,
        unit: '$',
        hint1: 'Calculate total cost first, then revenue from Batch A, revenue from Batch B, and subtract total cost.',
        hint2: `Cost = ${quantity} × $${costPerUnit} = $${totalCost}. Normal price = $${normalSelling}. Discounted price = 0.8 × $${normalSelling} = $${discountedSelling}.`,
        solutionSteps: [
          `Total Cost = ${quantity} × $${costPerUnit} = $${totalCost}`,
          `Normal selling price (50% markup) = $${costPerUnit} × 1.50 = $${normalSelling}`,
          `Batch A revenue = ${batchA_qty} × $${normalSelling} = $${revenueA}`,
          `Discounted clearance price = $${normalSelling} × 0.80 = $${discountedSelling}`,
          `Batch B revenue = ${batchB_qty} × $${discountedSelling} = $${revenueB}`,
          `Total Revenue = $${revenueA} + $${revenueB} = $${totalRevenue}`,
          `Overall Profit = $${totalRevenue} - $${totalCost} = $${overallProfit}`,
        ],
        fullExplanation: `After accounting for both full-price sales ($${revenueA}) and discounted clearance units ($${revenueB}), total revenue is $${totalRevenue}. Subtracting the initial inventory outlay of $${totalCost} leaves an overall net profit of $${overallProfit}.`,
        xpReward: 75,
        moneyReward: 200,
      };
    },
  },
];

// -------------------------------------------------------------
// QUESTION GENERATOR ENGINE WITH VALIDATION & ANTI-DUPLICATE
// -------------------------------------------------------------
export function generateQuestion(options: {
  topic?: TopicId;
  difficulty?: GameDifficulty;
  questionType?: QuestionType;
  historySignatures?: string[];
}): Question {
  const mode = options.difficulty || 'CORE';

  // Filter templates matching mode and topic if specified
  let validTemplates = TEMPLATES.filter((t) => {
    if (mode === 'CORE' && t.mode === 'EXTENDED') return false;
    if (options.topic && t.topic !== options.topic) return false;
    if (options.questionType && t.questionType !== options.questionType) return false;
    return true;
  });

  // Fallback if filter too restrictive
  if (validTemplates.length === 0) {
    validTemplates = TEMPLATES.filter((t) => {
      if (mode === 'CORE' && t.mode === 'EXTENDED') return false;
      return true;
    });
  }

  // Attempt up to 10 generations to find an anti-duplicate valid question
  const history = options.historySignatures || [];
  let candidateQuestion: Question | null = null;

  for (let attempt = 0; attempt < 10; attempt++) {
    const tmpl = pick(validTemplates);
    const q = tmpl.generate();

    // Verify mathematical bounds & valid answer
    if (q.correctAnswer === undefined || q.correctAnswer === null || Number.isNaN(q.correctAnswer)) {
      continue;
    }

    // Anti-duplicate check
    if (!history.includes(q.signature) || attempt >= 8) {
      candidateQuestion = q;
      break;
    }
  }

  // Fallback to first generated if all in history
  if (!candidateQuestion) {
    candidateQuestion = pick(validTemplates).generate();
  }

  return candidateQuestion;
}

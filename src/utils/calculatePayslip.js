
import { PAYSLIP_CONSTANTS } from "./constants.js";

// Get the number of calendar days in the selected month
export const daysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

// Round calculated amounts to two decimal places
const roundToTwo = (amount) => {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
};

// Calculate all payslip amounts from the entered inputs
export const calculatePayslip = (inputs) => {
  const {
    ctc,
    year,
    month,
    workingDays,
    leaveDays,
    pfSelected,
    pt,
    tds,
    advance,
  } = inputs;

  const {
    PT_DEFAULT,
    INSURANCE_FUND,
    EMPLOYEE_PF_BASE,
    EMPLOYER_PF_BASE,
    EARNINGS_SPLIT,
  } = PAYSLIP_CONSTANTS;

  // Convert form values into numbers before calculating
  const ctcAmount = Number(ctc);
  const workingDaysCount = Number(workingDays);
  const leaveDaysCount = Number(leaveDays);
  const ptAmount =
    pt === "" || pt == null ? PT_DEFAULT : Number(pt);
  const tdsAmount = Number(tds);
  const advanceAmount = Number(advance);

  // Step 1: Work out paid days and pay ratio
  const totalDays = daysInMonth(year, month);
  const paidDays = workingDaysCount - leaveDaysCount;
  const payRatio = paidDays / totalDays;

  // Step 2: Calculate monthly and prorated compensation
  const monthlyCompensation =
    ctcAmount - ptAmount - INSURANCE_FUND;

  const perDayCompensation =
    Math.round(
      (monthlyCompensation / totalDays) * 1000000
    ) / 1000000;

  const proratedGross = roundToTwo(
    perDayCompensation * paidDays
  );

  // Step 3: Split the gross into earnings
  const basicPay = roundToTwo(
    proratedGross * EARNINGS_SPLIT.BASIC
  );

  const hra = roundToTwo(
    proratedGross * EARNINGS_SPLIT.HRA
  );

  const medicalAllowance = roundToTwo(
    proratedGross * EARNINGS_SPLIT.MEDICAL
  );

  const specialAllowance = roundToTwo(
    proratedGross - basicPay - hra - medicalAllowance
  );

  const totalEarnings = roundToTwo(
    basicPay + hra + medicalAllowance + specialAllowance
  );

  // Step 4: Calculate employee and employer PF
  const employeePF = pfSelected
    ? roundToTwo(EMPLOYEE_PF_BASE * payRatio)
    : 0;

  const employerPF = pfSelected
    ? roundToTwo(EMPLOYER_PF_BASE * payRatio)
    : 0;

  // Step 5: Calculate deductions and final take-home pay
  const totalDeductions = roundToTwo(
    employeePF + employerPF + tdsAmount + advanceAmount
  );

  const netPay = roundToTwo(
    proratedGross - totalDeductions
  );

  return {
    totalDays,
    workingDays: workingDaysCount,
    leaveDays: leaveDaysCount,
    paidDays,
    payRatio,

    monthlyCompensation,
    perDayCompensation,
    proratedGross,

    basicPay,
    hra,
    medicalAllowance,
    specialAllowance,
    totalEarnings,

    pt: ptAmount,
    insuranceFund: INSURANCE_FUND,
    employeePF,
    employerPF,
    tds: tdsAmount,
    advance: advanceAmount,

    totalDeductions,
    netPay,
    deductionsExceedEarnings: netPay < 0,
  };
};

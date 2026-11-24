
import { describe, it, expect } from "vitest";
import { calculatePayslip, daysInMonth } from "../utils/calculatePayslip.js";

// Common inputs used in the assignment examples
const defaultInputs = {
  ctc: 60000,
  year: 2026,
  month: 10,
  workingDays: 22,
  leaveDays: 2,
  pfSelected: true,
  pt: 200,
  tds: 1500,
  advance: 2000,
};

describe("Payslip calculations", () => {
  it("Case 1: calculates the worked example correctly", () => {
    const result = calculatePayslip(defaultInputs);

    expect(result.paidDays).toBe(20);
    expect(result.proratedGross).toBe(38129.03);
    expect(result.totalDeductions).toBe(7370.96);
    expect(result.netPay).toBe(30758.07);
  });

  it("Case 2: sets both PF amounts to zero when PF is off", () => {
    const result = calculatePayslip({
      ...defaultInputs,
      pfSelected: false,
    });

    expect(result.employeePF).toBe(0);
    expect(result.employerPF).toBe(0);
    expect(result.totalDeductions).toBe(3500);
    expect(result.netPay).toBe(34629.03);
  });

  it("Case 3: calculates full attendance correctly", () => {
    const result = calculatePayslip({
      ...defaultInputs,
      workingDays: 31,
      leaveDays: 0,
      tds: 0,
      advance: 0,
    });

    expect(result.proratedGross).toBe(59100);
    expect(result.basicPay).toBe(23640);
    expect(result.specialAllowance).toBe(17730);
    expect(result.employeePF).toBe(3000);
    expect(result.employerPF).toBe(3000);
    expect(result.netPay).toBe(53100);
  });

  it("Case 4: recalculates everything when PT changes", () => {
    const result = calculatePayslip({
      ...defaultInputs,
      pt: 300,
    });

    expect(result.perDayCompensation).toBe(1903.225806);
    expect(result.proratedGross).toBe(38064.52);
    expect(result.netPay).toBe(30693.56);
  });

  it("Case 7: handles zero paid days and negative net pay", () => {
    const result = calculatePayslip({
      ...defaultInputs,
      workingDays: 5,
      leaveDays: 5,
    });

    expect(result.paidDays).toBe(0);
    expect(result.proratedGross).toBe(0);
    expect(result.employeePF).toBe(0);
    expect(result.employerPF).toBe(0);
    expect(result.netPay).toBe(-3500);
    expect(result.deductionsExceedEarnings).toBe(true);
  });

  it("Case 9: handles February in a leap year", () => {
    const result = calculatePayslip({
      ...defaultInputs,
      year: 2028,
      month: 2,
      workingDays: 29,
      leaveDays: 0,
    });

    expect(result.totalDays).toBe(29);
  });
});

describe("Days in month", () => {
  it("returns 31 days for October 2026", () => {
    expect(daysInMonth(2026, 10)).toBe(31);
  });

  it("returns 28 days for February 2027", () => {
    expect(daysInMonth(2027, 2)).toBe(28);
  });

  it("returns 29 days for February 2028", () => {
    expect(daysInMonth(2028, 2)).toBe(29);
  });
});

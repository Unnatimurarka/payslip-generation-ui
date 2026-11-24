
import { describe, it, expect } from "vitest";
import { validate } from "../utils/validate.js";

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

describe("Payslip validation", () => {
  it("Case 5: rejects working days above calendar days", () => {
    const errors = validate({
      ...defaultInputs,
      workingDays: 32,
    });

    expect(errors.workingDays).toBe(
      "Working days cannot exceed 31 days in the selected month."
    );
  });

  it("Case 6: rejects leave days above working days", () => {
    const errors = validate({
      ...defaultInputs,
      workingDays: 22,
      leaveDays: 23,
    });

    expect(errors.leaveDays).toBe(
      "Leave days cannot exceed working days."
    );
  });

  it("Case 6: rejects negative leave days", () => {
    const errors = validate({
      ...defaultInputs,
      leaveDays: -1,
    });

    expect(errors.leaveDays).toBe(
      "Leave days cannot be negative."
    );
  });

  it("Case 8: rejects 29 working days in February 2027", () => {
    const errors = validate({
      ...defaultInputs,
      year: 2027,
      month: 2,
      workingDays: 29,
    });

    expect(errors.workingDays).toBe(
      "Working days cannot exceed 28 days in the selected month."
    );
  });

  it("Case 8: accepts 28 working days in February 2027", () => {
    const errors = validate({
      ...defaultInputs,
      year: 2027,
      month: 2,
      workingDays: 28,
    });

    expect(errors.workingDays).toBeUndefined();
  });

  it("Case 10: rejects 31 working days after changing October to November", () => {
    const errors = validate({
      ...defaultInputs,
      month: 11,
      workingDays: 31,
    });

    expect(errors.workingDays).toBe(
      "Working days cannot exceed 30 days in the selected month."
    );
  });

  it("accepts 31 working days in October 2026", () => {
    const errors = validate({
      ...defaultInputs,
      workingDays: 31,
      leaveDays: 0,
    });

    expect(errors.workingDays).toBeUndefined();
  });
});

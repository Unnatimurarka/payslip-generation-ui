
import { daysInMonth } from "./calculatePayslip.js";
import { PAYSLIP_CONSTANTS } from "./constants.js";

// Check the form values before calculating the payslip
export const validate = (inputs) => {
  const errors = {};

  const isEmpty = (value) =>
    value === "" || value === null || value === undefined;

  const isValidNumber = (value) =>
    !isEmpty(value) && Number.isFinite(Number(value));

  const ctc = Number(inputs.ctc);
  const pt = Number(inputs.pt);
  const workingDays = Number(inputs.workingDays);
  const leaveDays = Number(inputs.leaveDays);

  // HR CTC is required and must be greater than zero
  if (isEmpty(inputs.ctc)) {
    errors.ctc = "This field is required.";
  } else if (!isValidNumber(inputs.ctc) || ctc <= 0) {
    errors.ctc = "HR CTC must be greater than 0.";
  }

  // Month and year are required
  if (isEmpty(inputs.month) || isEmpty(inputs.year)) {
    errors.month = "This field is required.";
  } else {
    const month = Number(inputs.month);
    const year = Number(inputs.year);

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(year) ||
      year < 1
    ) {
      errors.month = "Please select a valid month and year.";
    }
  }

  // Check working days against the selected month's calendar days
  if (isEmpty(inputs.workingDays)) {
    errors.workingDays = "This field is required.";
  } else if (
    !isValidNumber(inputs.workingDays) ||
    !Number.isInteger(workingDays) ||
    workingDays < 0
  ) {
    errors.workingDays =
      "Working days must be a whole number of 0 or more.";
  } else if (
    !errors.month &&
    workingDays > daysInMonth(Number(inputs.year), Number(inputs.month))
  ) {
    const totalDays = daysInMonth(
      Number(inputs.year),
      Number(inputs.month)
    );

    errors.workingDays =
      `Working days cannot exceed ${totalDays} days in the selected month.`;
  }

  // Leave days must be whole numbers, non-negative and within working days
  if (isEmpty(inputs.leaveDays)) {
    errors.leaveDays = "This field is required.";
  } else if (
    !isValidNumber(inputs.leaveDays) ||
    !Number.isInteger(leaveDays)
  ) {
    errors.leaveDays = "Leave days must be a whole number.";
  } else if (leaveDays < 0) {
    errors.leaveDays = "Leave days cannot be negative.";
  } else if (
    isValidNumber(inputs.workingDays) &&
    leaveDays > workingDays
  ) {
    errors.leaveDays = "Leave days cannot exceed working days.";
  }

  // TDS, advance and PT must be zero or more
  const amountFields = ["tds", "advance", "pt"];

  amountFields.forEach((field) => {
    const value = inputs[field];

    if (isEmpty(value)) {
      errors[field] = "This field is required.";
    } else if (!isValidNumber(value) || Number(value) < 0) {
      errors[field] = "Amount cannot be negative.";
    }
  });

  // PT and IF should not exceed the entered CTC together
  if (
    isValidNumber(inputs.ctc) &&
    Number.isFinite(pt) &&
    !errors.pt &&
    ctc > 0 &&
    pt + PAYSLIP_CONSTANTS.INSURANCE_FUND > ctc
  ) {
    errors.pt = "PT and IF together exceed the HR CTC.";
  }

  return errors;
};

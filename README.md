# Payslip Generation UI

A React-based payslip generation application designed to simplify the process of preparing employee payslips using payroll inputs and predefined salary calculation rules.

## Overview

This project provides a user-friendly interface for selecting employees, entering payroll details, calculating salary components, and reviewing payslip information.

It uses mock employee data and performs calculations on the frontend without requiring a backend.

## Features

- Employee and client selection
- Payroll input form with validation
- Salary calculation based on CTC and paid days
- Automatic calculation of Basic Salary, HRA, Medical Allowance, and Special Allowance
- Employee and employer PF calculations
- TDS, advance, and professional tax deductions
- Payslip preview with earnings, deductions, and net pay
- Responsive user interface
- Unit tests for salary calculations and input validation

## Tech Stack

- React
- JavaScript
- Vite
- CSS
- Vitest

## Salary Calculation

The application uses predefined salary components and payroll rules to calculate:

- Gross Earnings
- Employee PF
- Employer PF
- Total Deductions
- Net Pay

Salary is prorated based on paid days in the selected month.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project folder:

   ```bash
   cd payslip-generation-ui
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

## Running Tests

Run the unit tests using:

```bash
npm test
```

## Project Structure

```text
src/
├── data/
│   └── mockData.js
├── tests/
│   ├── calculatePayslip.test.js
│   └── validate.test.js
├── utils/
│   ├── calculatePayslip.js
│   ├── constants.js
│   └── validate.js
├── App.jsx
├── App.css
└── index.css
```

## Project Scope

This is a frontend assignment developed using mock data. It does not include backend integration, database storage, or actual email delivery.

---

**Developed as a Payslip Generation UI assignment.**

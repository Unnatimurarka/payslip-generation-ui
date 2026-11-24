# Payslip Generation UI

A responsive, React-based payslip generation application that simplifies employee payroll processing, salary calculations, payslip review, and distribution preparation.

## Live Demo

[Open Payslip Generation UI](https://payslip-generation-ui.vercel.app)

## GitHub Repository

[View Source Code](https://github.com/Unnatimurarka/payslip-generation-ui)

---

## Project Overview

The Payslip Generation UI is a frontend application developed to streamline the process of preparing employee payslips.

It provides a four-step workflow covering employee selection, payroll input, payslip review, and distribution preparation.

The application uses mock employee data and performs payroll calculations on the frontend without requiring backend integration.

## Key Features

### 1. Employee Selection
- Select a client.
- Select an employee from the available employee list.
- View employee information such as employee ID, designation, and joining date.

### 2. Payroll Inputs
- Enter employee CTC and payroll details.
- Select the payroll month and year.
- Enter working days and leave days.
- Configure professional tax, TDS, and advance deductions.
- Enable or disable PF calculations.
- Validate inputs before proceeding.

### 3. Payslip Review
- Automatically calculate salary components.
- Display gross earnings and deductions.
- Calculate employee and employer PF.
- Display total deductions and final net pay.
- Review the generated payslip before distribution.

### 4. Distribution Preparation
- Review employee recipient information.
- View payslip details before confirmation.
- Prepare the payslip for distribution.
- Display a confirmation and completion status.

**Note:** Distribution is simulated on the frontend. The application does not send actual emails or perform backend delivery.

## Salary Calculation

The application follows predefined payroll rules and salary components.

| Salary Component | Calculation |
|---|---|
| Basic Salary | 40% |
| HRA | 20% |
| Medical Allowance | 10% |
| Special Allowance | Remaining gross earnings |
| Employee PF | ₹3,000 prorated based on paid days |
| Employer PF | ₹3,000 prorated based on paid days |
| Insurance Fund | ₹700 |
| Professional Tax | Default ₹200 |

Salary is prorated based on paid days in the selected month.

The application also calculates total deductions and net pay using the configured payroll inputs.

## Tech Stack

- React
- JavaScript
- Vite
- CSS
- Vitest

## Project Structure

```text
payslip-generation-ui/
│
├── public/
├── src/
│   ├── data/
│   │   └── mockData.js
│   │
│   ├── tests/
│   │   ├── calculatePayslip.test.js
│   │   └── validate.test.js
│   │
│   ├── utils/
│   │   ├── calculatePayslip.js
│   │   ├── constants.js
│   │   └── validate.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Unnatimurarka/payslip-generation-ui.git
```

2. Navigate to the project directory:

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

The test suite covers:
- Salary calculation scenarios.
- Payroll input validation.
- Invalid and boundary input cases.

## Build for Production

```bash
npm run build
```

The production-ready files are generated in the `dist` directory.

## Assumptions and Limitations

- Employee information is maintained using mock data.
- Payroll calculations follow the predefined rules and constants provided for the assignment.
- Salary calculations and validation are performed on the frontend.
- No backend, database, or persistent payroll storage is integrated.
- Distribution preparation is a frontend simulation; no actual email is sent.
- This application is intended as an assignment demonstration and not a production payroll system.

## Testing Summary

The project includes separate unit test files for salary calculations and input validation.

Both test suites passed during development, with 16 tests passing across the two test files.

---

**Developed as a Payslip Generation UI assignment.**

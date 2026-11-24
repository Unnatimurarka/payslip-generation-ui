
import { useState } from "react";
import { clients } from "./data/mockData";
import { PAYSLIP_CONSTANTS } from "./utils/constants";
import { validate } from "./utils/validate";
import { calculatePayslip } from "./utils/calculatePayslip";
import "./App.css";

const steps = [
  "Employee details",
  "Salary inputs",
  "Review payslip",
  "Distribution",
];

const today = new Date();

const initialInputs = {
  ctc: "",
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  workingDays: "",
  leaveDays: "0",
  pfSelected: false,
  tds: "0",
  advance: "0",
  pt: String(PAYSLIP_CONSTANTS.PT_DEFAULT),
};

function App() {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState(initialInputs);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPrepared, setIsPrepared] = useState(false);

  const client = clients.find(
    (item) => item.id === selectedClient
  );

  const candidate = client?.candidates.find(
    (item) => item.id === selectedCandidate
  );


  const errors = validate(inputs);
  const hasErrors = Object.keys(errors).length > 0;
  const activeErrors = Object.keys(errors).filter(
    (field) => touched[field] || submitted
);

  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
    setSelectedCandidate("");
    setCurrentStep(1);
  };

  const handleCandidateChange = (event) => {
    setSelectedCandidate(event.target.value);
  };

  // Keep the form values together so they are easy to pass to the calculation.
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setInputs((previous) => ({
      ...previous,
      [name]: value,
    }));

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));
  };

  const handlePfChange = (event) => {
    setInputs((previous) => ({
      ...previous,
      pfSelected: event.target.checked,
    }));
  };

  const handleNext = () => {
    setSubmitted(true);

    if (currentStep === 1 && client && candidate) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2 && !hasErrors) {
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3 && payslip) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (isPrepared) return;
    setCurrentStep((previous) => previous - 1);
  };

  const handleConfirmPreparation = () => {
    setIsPrepared(true);
    setShowConfirmation(false);
  };

  const handleStartAnother = () => {
    setSelectedClient("");
    setSelectedCandidate("");
    setCurrentStep(1);
    setInputs({ ...initialInputs });
    setTouched({});
    setSubmitted(false);
    setShowConfirmation(false);
    setIsPrepared(false);
  };

  const showError = (field) => {
    return (touched[field] || submitted) ? errors[field] : "";
  };

  const canContinue = Boolean(client && candidate);

  // Calculate once and use the same result throughout the review screen
const payslip =
  canContinue && !hasErrors
    ? calculatePayslip(inputs)
    : null;

const formatMoney = (amount) =>
  Number(amount).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const monthValue = `${inputs.year}-${String(inputs.month).padStart(2, "0")}`;

  const handleMonthChange = (event) => {
    const [year, month] = event.target.value.split("-");

    setInputs((previous) => ({
      ...previous,
      year: Number(year),
      month: Number(month),
    }));

    setTouched((previous) => ({
      ...previous,
      month: true,
      workingDays: true,
      leaveDays: true,
    }));
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">D</div>
          <div>
            <h2>derive</h2>
            <span>RECRUITMENT</span>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>

          <div className="nav-item">
            <span className="nav-icon">▦</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span className="nav-icon">♙</span>
            Candidates
          </div>

          <div className="nav-item">
            <span className="nav-icon">▤</span>
            Clients
          </div>

          <div className="nav-item active">
            <span className="nav-icon">₹</span>
            Payroll
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="user-avatar">HR</div>
          <div>
            <strong>HR Administrator</strong>
            <span>Workspace account</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / Payroll</span>
            <h1>Payslip generation</h1>
          </div>

          <div className="topbar-right">
            <span className="status-dot"></span>
            <span>Draft</span>
            <div className="topbar-avatar">HR</div>
          </div>
        </header>

        <section className="page-intro">
          <div>
            <p className="eyebrow">PAYROLL MANAGEMENT</p>
            <h2>Prepare a new payslip</h2>
            <p className="intro-text">
              Select an employee and enter the payroll details
              to prepare their monthly payslip.
            </p>
          </div>

          <div className="period-note">
            <span>PAYROLL CYCLE</span>
            <strong>Monthly processing</strong>
          </div>
        </section>

        <section className="stepper">
          {steps.map((step, index) => {
            const stepNumber = index + 1;

            return (
              <div
                className={`step-item ${
                  currentStep === stepNumber ? "current" : ""
                } ${currentStep > stepNumber ? "completed" : ""}`}
                key={step}
              >
                <div className="step-number">
                  {currentStep > stepNumber ? "✓" : stepNumber}
                </div>
                <span>{step}</span>
              </div>
            );
          })}
        </section>

        {currentStep === 1 && (
          <section className="form-section">
            <div className="section-heading">
              <div>
                <span className="section-number">01 / EMPLOYEE</span>
                <h3>Who is this payslip for?</h3>
                <p>
                  Choose a client first, then select the candidate
                  associated with that client.
                </p>
              </div>

              <span className="required-note">* Required fields</span>
            </div>

            <div className="selection-grid">
              <div className="field-group">
                <label htmlFor="client">Client / Company *</label>
                <select
                  id="client"
                  value={selectedClient}
                  onChange={handleClientChange}
                >
                  <option value="">Select a client</option>
                  {clients.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <small>Select the company employing the candidate.</small>
              </div>

              <div className="field-group">
                <label htmlFor="candidate">Candidate / Application *</label>
                <select
                  id="candidate"
                  value={selectedCandidate}
                  onChange={handleCandidateChange}
                  disabled={!client}
                >
                  <option value="">Select a candidate</option>
                  {client?.candidates.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <small>
                  {client
                    ? "Choose the employee for this payslip."
                    : "Choose a client to see its candidates."}
                </small>
              </div>
            </div>

            {!canContinue ? (
              <div className="empty-state">
                <div className="empty-icon">♙</div>
                <strong>
                  Select a client and candidate to start a payslip
                </strong>
                <span>
                  Employee information will appear here after selection.
                </span>
              </div>
            ) : (
              <div className="employee-details">
                <div className="employee-heading">
                  <div className="employee-avatar">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <span className="eyebrow">SELECTED EMPLOYEE</span>
                    <h4>{candidate.name}</h4>
                    <p>{candidate.designation}</p>
                  </div>
                  <span className="selected-tag">Selected</span>
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <span>Client / Company</span>
                    <strong>{client.name}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Employee ID</span>
                    <strong>{candidate.employeeId}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Designation</span>
                    <strong>{candidate.designation}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Date of joining</span>
                    <strong>{candidate.dateOfJoining}</strong>
                  </div>

                  <div className="detail-item">
                    <span>PAN number</span>
                    <strong>{candidate.pan || "Not provided"}</strong>
                  </div>

                  <div className="detail-item">
                    <span>PF UAN</span>
                    <strong>{candidate.uan || "Not provided"}</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="form-footer">
              <span>Step 1 of 4 · Employee details</span>
              <button
                className="primary-button"
                disabled={!canContinue}
                onClick={handleNext}
              >
                Continue to salary inputs <span>→</span>
              </button>
            </div>
          </section>
        )}

        {currentStep === 2 && (
          <section className="form-section salary-section">
            <div className="section-heading">
              <div>
                <span className="section-number">02 / PAYROLL DETAILS</span>
                <h3>Enter salary information</h3>
                <p>
                  Add the monthly salary and attendance details
                  for the selected employee.
                </p>
              </div>

              <span className="required-note">* Required fields</span>
            </div>

            <div className="selected-employee-strip">
              <div className="employee-avatar">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <strong>{candidate.name}</strong>
                <span>{candidate.employeeId} · {client.name}</span>
              </div>
              <span className="selected-tag">Employee selected</span>
            </div>

            <div className="salary-group">
              <div className="salary-group-heading">
                <span className="group-index">01</span>
                <div>
                  <h4>Salary period and CTC</h4>
                  <p>Enter the monthly compensation details.</p>
                </div>
              </div>

              <div className="salary-fields">
                <div className="field-group">
                  <label htmlFor="ctc">HR CTC (monthly) *</label>
                  <div className="input-with-prefix">
                    <span>₹</span>
                    <input
                      id="ctc"
                      name="ctc"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter monthly CTC"
                      value={inputs.ctc}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(showError("ctc"))}
                      aria-describedby="ctc-error"
                    />
                  </div>
                  <small id="ctc-error" className="field-error">
                    {showError("ctc") && `⚠ ${showError("ctc")}`}
                  </small>
                </div>

                <div className="field-group">
                  <label htmlFor="pay-month">Payslip month and year *</label>
                  <input
                    id="pay-month"
                    type="month"
                    value={monthValue}
                    onChange={handleMonthChange}
                    aria-invalid={Boolean(showError("month"))}
                    aria-describedby="month-error"
                  />
                  <small id="month-error" className="field-error">
                    {showError("month") && `⚠ ${showError("month")}`}
                  </small>
                </div>
              </div>
            </div>

            <div className="salary-group">
              <div className="salary-group-heading">
                <span className="group-index">02</span>
                <div>
                  <h4>Attendance details</h4>
                  <p>Enter the employee's working and leave days.</p>
                </div>
              </div>

              <div className="salary-fields">
                <div className="field-group">
                  <label htmlFor="workingDays">Working days *</label>
                  <input
                    id="workingDays"
                    name="workingDays"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Enter working days"
                    value={inputs.workingDays}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(showError("workingDays"))}
                    aria-describedby="working-error"
                  />
                  <small id="working-error" className="field-error">
                    {showError("workingDays") && `⚠ ${showError("workingDays")}`}
                  </small>
                </div>

                <div className="field-group">
                  <label htmlFor="leaveDays">Leave days</label>
                  <input
                    id="leaveDays"
                    name="leaveDays"
                    type="number"
                    min="0"
                    step="1"
                    value={inputs.leaveDays}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(showError("leaveDays"))}
                    aria-describedby="leave-error"
                  />
                  <small id="leave-error" className="field-error">
                    {showError("leaveDays") && `⚠ ${showError("leaveDays")}`}
                  </small>
                </div>
              </div>
            </div>

            <div className="salary-group">
              <div className="salary-group-heading">
                <span className="group-index">03</span>
                <div>
                  <h4>Provident fund</h4>
                  <p>Choose whether PF applies to this employee.</p>
                </div>
              </div>

              <label className="pf-toggle" htmlFor="pfSelected">
                <div>
                  <strong>Employee wants PF</strong>
                  <span>When switched off, both PF amounts will be zero.</span>
                </div>

                <input
                  id="pfSelected"
                  type="checkbox"
                  checked={inputs.pfSelected}
                  onChange={handlePfChange}
                />
                <span className="toggle-track" aria-hidden="true"></span>
                <span className="toggle-value">
                  {inputs.pfSelected ? "Yes" : "No"}
                </span>
              </label>
            </div>

            <div className="salary-group">
              <div className="salary-group-heading">
                <span className="group-index">04</span>
                <div>
                  <h4>Deductions and contributions</h4>
                  <p>Enter the applicable amounts for this pay period.</p>
                </div>
              </div>

              <div className="salary-fields">
                <div className="field-group">
                  <label htmlFor="pt">Professional tax (PT)</label>
                  <div className="input-with-prefix">
                    <span>₹</span>
                    <input
                      id="pt"
                      name="pt"
                      type="number"
                      min="0"
                      step="0.01"
                      value={inputs.pt}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(showError("pt"))}
                      aria-describedby="pt-error"
                    />
                  </div>
                  <small id="pt-error" className="field-error">
                    {showError("pt") && `⚠ ${showError("pt")}`}
                  </small>
                </div>

                <div className="field-group">
                  <label htmlFor="if-amount">Insurance Fund (IF)</label>
                  <div className="input-with-prefix readonly-field">
                    <span>₹</span>
                    <input
                      id="if-amount"
                      type="text"
                      value={PAYSLIP_CONSTANTS.INSURANCE_FUND}
                      readOnly
                    />
                  </div>
                  <small>Fixed amount · Read only</small>
                </div>

                <div className="field-group">
                  <label htmlFor="tds">TDS amount</label>
                  <div className="input-with-prefix">
                    <span>₹</span>
                    <input
                      id="tds"
                      name="tds"
                      type="number"
                      min="0"
                      step="0.01"
                      value={inputs.tds}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(showError("tds"))}
                      aria-describedby="tds-error"
                    />
                  </div>
                  <small id="tds-error" className="field-error">
                    {showError("tds") && `⚠ ${showError("tds")}`}
                  </small>
                </div>

                <div className="field-group">
                  <label htmlFor="advance">Advance deduction</label>
                  <div className="input-with-prefix">
                    <span>₹</span>
                    <input
                      id="advance"
                      name="advance"
                      type="number"
                      min="0"
                      step="0.01"
                      value={inputs.advance}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(showError("advance"))}
                      aria-describedby="advance-error"
                    />
                  </div>
                  <small id="advance-error" className="field-error">
                    {showError("advance") && `⚠ ${showError("advance")}`}
                  </small>
                </div>
              </div>
            </div>

            <div className="form-footer salary-footer">
              <button
                className="secondary-button"
                onClick={handleBack}
              >
                ← Back to employee
              </button>

              <div className="next-action">
                <span>Step 2 of 4 · Salary inputs</span>
                <button
                  className="primary-button"
                  onClick={handleNext}
                  disabled={activeErrors.length > 0}
                >
                  Continue to payslip review <span>→</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {currentStep === 3 && (
          <section className="form-section review-section">
            <div className="section-heading">
              <div>
                <span className="section-number">03 / PAYSLIP REVIEW</span>
                <h3>Review salary breakdown</h3>
                <p>
                  Check the calculated earnings and deductions
                  before preparing the payslip.
                </p>
              </div>
              <span className="selected-tag">Calculation preview</span>
            </div>

            {!payslip ? (
              <div className="empty-state">
                <strong>Complete the inputs to see the payslip</strong>
                <span>
                  Return to salary inputs and correct any errors.
                </span>
              </div>
            ) : (
              <div className="payslip-document">
                <div className="payslip-top">
                  <div>
                    <span className="eyebrow">PAYROLL STATEMENT</span>
                    <h2>{client.name}</h2>
                    <p>Monthly employee payslip</p>
                  </div>
                  <div className="payslip-stamp">PAYSLIP</div>
                </div>

                <div className="payslip-period">
                  <div>
                    <span>PAY PERIOD</span>
                    <strong>
                      {new Date(
                        inputs.year,
                        inputs.month - 1
                      ).toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                  </div>
                  <div>
                    <span>PAID DAYS</span>
                    <strong>
                      {payslip.paidDays} of {payslip.totalDays}
                    </strong>
                  </div>
                  <div>
                    <span>WORKING DAYS</span>
                    <strong>{payslip.workingDays}</strong>
                  </div>
                  <div>
                    <span>LEAVE DAYS</span>
                    <strong>{payslip.leaveDays}</strong>
                  </div>
                </div>

                <div className="payslip-employee">
                  <h4>Employee information</h4>
                  <div className="payslip-identity-grid">
                    <div>
                      <span>Employee name</span>
                      <strong>{candidate.name}</strong>
                    </div>
                    <div>
                      <span>Employee ID</span>
                      <strong>{candidate.employeeId}</strong>
                    </div>
                    <div>
                      <span>Designation</span>
                      <strong>{candidate.designation}</strong>
                    </div>
                    <div>
                      <span>Date of joining</span>
                      <strong>{candidate.dateOfJoining}</strong>
                    </div>
                    <div>
                      <span>PAN number</span>
                      <strong>{candidate.pan || "Not provided"}</strong>
                    </div>
                    <div>
                      <span>PF UAN</span>
                      <strong>{candidate.uan || "Not provided"}</strong>
                    </div>
                  </div>
                </div>

                <div className="payslip-tables">
                  <div className="payslip-table-block">
                    <h4>Earnings</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Basic Pay</td>
                          <td>{formatMoney(payslip.basicPay)}</td>
                        </tr>
                        <tr>
                          <td>HRA</td>
                          <td>{formatMoney(payslip.hra)}</td>
                        </tr>
                        <tr>
                          <td>Medical Allowance</td>
                          <td>{formatMoney(payslip.medicalAllowance)}</td>
                        </tr>
                        <tr>
                          <td>Special Allowance</td>
                          <td>{formatMoney(payslip.specialAllowance)}</td>
                        </tr>
                        <tr className="table-total">
                          <td>Total earnings</td>
                          <td>{formatMoney(payslip.totalEarnings)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="payslip-table-block">
                    <h4>Deductions</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>PT</td>
                          <td>{formatMoney(payslip.pt)}</td>
                        </tr>
                        <tr>
                          <td>Employee PF</td>
                          <td>{formatMoney(payslip.employeePF)}</td>
                        </tr>
                        <tr>
                          <td>Employer PF</td>
                          <td>{formatMoney(payslip.employerPF)}</td>
                        </tr>
                        <tr>
                          <td>Insurance Fund (IF)</td>
                          <td>{formatMoney(payslip.insuranceFund)}</td>
                        </tr>
                        <tr>
                          <td>TDS</td>
                          <td>{formatMoney(payslip.tds)}</td>
                        </tr>
                        <tr>
                          <td>Advance</td>
                          <td>{formatMoney(payslip.advance)}</td>
                        </tr>
                        <tr className="table-total">
                          <td>Total deductions</td>
                          <td>{formatMoney(payslip.totalDeductions)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="payslip-footnote">
                  PT and IF are already deducted from CTC before
                  proration and are not counted again in total deductions.
                </p>

                <div className="net-pay-section">
                  <div>
                    <span>NET PAY</span>
                    <p>Final take-home amount</p>
                  </div>
                  <strong>{formatMoney(payslip.netPay)}</strong>
                </div>

                {payslip.deductionsExceedEarnings && (
                  <div className="negative-warning" role="alert">
                    ⚠ Deductions exceed earnings. Net pay is negative.
                  </div>
                )}
              </div>
            )}

            <div className="form-footer review-footer">
              {!isPrepared && (
                <button
                  className="secondary-button"
                  onClick={handleBack}
                >
                  ← Back to salary inputs
                </button>
              )}

              <div className="next-action">
                <span>Step 3 of 4 · Review payslip</span>
                <button
                  className="primary-button"
                  onClick={handleNext}
                  disabled={!payslip || isPrepared}
                >
                  Continue to distribution <span>→</span>
                </button>
              </div>
            </div>
          </section>
        )}


        {currentStep === 4 && payslip && (
          <section className="form-section distribution-section">
            <div className="section-heading">
              <div>
                <span className="section-number">04 / DISTRIBUTION</span>
                <h3>{isPrepared ? "Payslip preparation complete" : "Prepare payslip for distribution"}</h3>
                <p>
                  Review the recipient and payroll summary before confirming.
                </p>
              </div>
              <span className={`distribution-status ${isPrepared ? "prepared" : "pending"}`}>
                {isPrepared ? "Prepared" : "Ready for review"}
              </span>
            </div>

            {isPrepared ? (
              <div className="prepared-state" role="status">
                <div className="prepared-icon">✓</div>
                <h4>Prepared for distribution</h4>
                <p>
                  The payslip has been marked as prepared. No email has been
                  sent and no file has been delivered.
                </p>
                <div className="distribution-summary">
                  <div>
                    <span>Recipient</span>
                    <strong>{candidate.email || "No email provided"}</strong>
                  </div>
                  <div>
                    <span>Pay period</span>
                    <strong>
                      {new Date(inputs.year, inputs.month - 1).toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                  </div>
                  <div>
                    <span>Net pay</span>
                    <strong>{formatMoney(payslip.netPay)}</strong>
                  </div>
                </div>
                <div className="form-footer distribution-footer">
                  <button className="secondary-button" onClick={() => setCurrentStep(3)}>
                    ← Back to review
                  </button>
                  <button className="primary-button" onClick={handleStartAnother}>
                    Start another payslip <span>→</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="distribution-card">
                  <div className="distribution-card-heading">
                    <div>
                      <span className="eyebrow">RECIPIENT DETAILS</span>
                      <h4>{candidate.name}</h4>
                    </div>
                    <span className="selected-tag">Candidate selected</span>
                  </div>
                  <div className="distribution-summary">
                    <div>
                      <span>Email address</span>
                      <strong>{candidate.email || "No email provided"}</strong>
                    </div>
                    <div>
                      <span>Client / Company</span>
                      <strong>{client.name}</strong>
                    </div>
                    <div>
                      <span>Pay period</span>
                      <strong>
                        {new Date(inputs.year, inputs.month - 1).toLocaleDateString("en-IN", {
                          month: "long",
                          year: "numeric",
                        })}
                      </strong>
                    </div>
                    <div>
                      <span>Paid days</span>
                      <strong>{payslip.paidDays} of {payslip.totalDays}</strong>
                    </div>
                    <div>
                      <span>Net pay</span>
                      <strong className="distribution-net-pay">{formatMoney(payslip.netPay)}</strong>
                    </div>
                  </div>
                </div>

                {!candidate.email && (
                  <div className="distribution-note" role="status">
                    No recipient email is available for this candidate. This demo
                    can still mark the payslip as prepared, but it will not send anything.
                  </div>
                )}

                <div className="distribution-note">
                  This is a front-end demonstration. Confirming will only update
                  the status on this screen; it will not email or deliver the payslip.
                </div>

                <div className="form-footer distribution-footer">
                  <button className="secondary-button" onClick={handleBack}>
                    ← Back to review
                  </button>
                  <button className="primary-button" onClick={() => setShowConfirmation(true)}>
                    Prepare for distribution <span>→</span>
                  </button>
                </div>
              </>
            )}

            {showConfirmation && (
              <div className="confirmation-backdrop" role="presentation">
                <div className="confirmation-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirmation-title" aria-describedby="confirmation-description">
                  <span className="eyebrow">FINAL CONFIRMATION</span>
                  <h3 id="confirmation-title">Prepare this payslip?</h3>
                  <p id="confirmation-description">
                    This will mark the payslip as prepared for {candidate.name}.
                    No email or file will be sent.
                  </p>
                  <div className="confirmation-actions">
                    <button className="secondary-button" onClick={() => setShowConfirmation(false)}>
                      Cancel
                    </button>
                    <button className="primary-button" onClick={handleConfirmPreparation}>
                      Confirm preparation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <footer className="page-footer">
          Payslip Generation <span>·</span> Internal payroll workspace
        </footer>
      </main>
    </div>
  );
}

export default App;

# Apex Origination — Commercial Loan Origination SaaS (LOS)

Apex Origination is a high-performance, single-screen enterprise workstation designed for modern commercial banking loan origination workflows. Crafted around a beautiful, human-centric **Bento Grid** theme, the application streamlines loan pipeline visibility, risk mitigation, and operational execution.

---

## 🚀 Key Features & Workspace Layout

### 1. Bento Grid Metric Row
The dashboard starts with a highly legible, bento-inspired summary card deck reflecting:
* **Active Pipeline**: Dynamically calculates the value of all ongoing deals (excluding complete ones).
* **Application Counter**: Real-time counter of registered records with visual bar accents.
* **SLA Warnings Tracker**: Immediate high-contrast alert detailing applications exceeding their SLA limits.
* **Average Portfolio Age**: Computes the mean duration of currently active files to maintain workflow health.

### 2. Multi-Stage Kanban Workstation
A beautiful, responsive grid dividing credit and mortgage origination case portfolios into six standardized operational workflow phases:
1. **Lead Initiation** — Early prospect registration & core commercial inquiry setup.
2. **Customer Onboarding** — Gathering critical business registry evidence and personal IDs.
3. **Underwriting** — In-depth financial analysis, field visit surveys, and CRAN preparation.
4. **Credit Approval** — Rigid managerial risk assessments and floating base rate margin signoffs.
5. **Documentation & Disbursement** — Operational mortgage registrations and legal stamping reviews.
6. **Complete** — Active limit distribution and live corporate account record generation.

### 3. Role-Based Sandbox Switcher
Simulate realistic cross-departmental operations by changing your sandbox security role directly from the top bar:
* **Relationship Manager (RM)**: Authorized to register fresh prospects, compile minutes, and record co-borrowers.
* **Credit Analyst**: Empowered to resolve underwriting checks, assess operational cash flows, and write memos.
* **Credit Manager (Approver)**: Holds high-level authority to sign off on recommended loan limits or request edits.
* **Operations Team**: Conducts security duty clearance, registers stamps, and triggers final disbursement.
* **Admin**: Enjoys full override access to run quick sandbox experiments.

### 4. Smart Business Guardrails
The Kanban board is protected by high-integrity guard logic:
* **Paperwork Guard**: Prevents moving deals into **Underwriting** until 100% of onboarding documentation verification checklists are complete.
* **Analysis Control**: Rejects dragging deals into **Credit Approval** if there are remaining checklist tasks outstanding in Underwriting.

### 5. Detailed Case Workspace & Analytics
* **Reports Dashboard**: Track geographic profiles, business segment focus ratios, and risk score graphs cleanly with custom D3-style layouts.
* **Jira-Style Modal drawer**: Double-click any applicant card to update their progress tracking, write communications, and append documents.

---

## 💾 How to Download the Codebase

You can easily export this entire generated React application to run locally on your own environment:


   * *Alternatively*, click **Export to GitHub** to directly link and commit the source files into a git repository.
1. **Running Locally**:
   * Extract the ZIP file directory.
   * Open your local terminal inside the extracted directory.
   * Run the standard package installers:
     ```bash
     npm install
     ```
   * Fire up the local development server:
     ```bash
     npm run dev
     ```
   * Open the URL `http://localhost:3000` in your web browser to access your premium local loan workstation.

---

*Authored with precision using Inter display typography and Outfit geometric aesthetics.*

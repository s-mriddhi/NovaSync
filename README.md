# NovaSync:

NovaSync is a full-stack expense-splitting web application built to simplify group expense management. It enables users to create groups, add expenses, and split costs using multiple strategies with accurate calculations and reliable backend logic.

---

## Key Features

* Group-based expense management
* Multiple split strategies: Equal, Exact, Percentage
* Automatic balance calculation and settlements
* User-friendly data representation (names instead of raw IDs)
* Responsive and intuitive UI

---

##  Tech Stack

* **Frontend:** React.js, HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express.js, REST APIs
* **Database:** PostgreSQL
* **Tools:** Git, GitHub, VS Code, Postman

---

## System Overview

* Client–server architecture
* React frontend communicates with backend via RESTful APIs
* Express server handles business logic, validations, and error handling
* PostgreSQL stores normalized relational data for users, groups, expenses, and splits

---

## API Capabilities 

* Create and manage groups
* Add and retrieve expenses by group
* Handle equal, exact, and percentage-based splits
* Fetch balances and settlements

---

## Expense Split Logic (Explained)

NovaSync supports three expense-splitting strategies. All calculations are handled on the backend to ensure correctness and consistency.

### 1. Equal Split

* Total expense amount is divided equally among all participants
* Each participant owes:
  `amount / number_of_participants`
* Rounding differences are handled to maintain total consistency

### 2. Exact Amount Split

* Each participant specifies the exact amount they owe
* Backend validates that the sum of all exact amounts equals the total expense
* Prevents inconsistent or invalid splits through strict validation

### 3. Percentage-Based Split

* Each participant specifies a percentage share
* Backend ensures total percentage equals 100%
* Owed amount is calculated as:
  `total_amount × (percentage / 100)`

### Balance & Settlement Calculation

* Net balance is computed per user based on paid vs owed amounts
* Positive balance → user should receive money
* Negative balance → user owes money
* Settlement data is derived server-side to keep frontend logic minimal

Settlement as a Flow Problem (Intuition)

Users with +balance → containers that need filling
Users with -balance → containers that have water to give
We just move water until all containers are level (0).

### Greedy Strategy (High-Level)
Step 1: Separate Users
Creditors → balance > 0
Debtors → balance < 0
Step 2: Sort (optional but helps)
Creditors: descending balance
Debtors: ascending balance (most negative first)
Step 3: Match Greedily
---

## ⚙️ Local Setup

```bash
# Clone repository
git clone https://github.com/your-username/novasync.git

# Backend setup
cd novasync/backend
npm install
npm run dev

# Frontend setup
cd ../novasync-frontend
npm install
npm start
```

---

## Engineering Highlights

* Designed RESTful APIs with clear request–response contracts
* Implemented input validation, centralized error handling, and transaction-safe operations
* Optimized PostgreSQL queries and joins for efficient relational data retrieval
* Ensured seamless frontend–backend integration with React

---

## 📌 Future Enhancements

* Add comments section for each group and personal ledgers
* Expense analytics and summaries
* Deployment
---

## 👤 Author

**Samriddhi Singh** — B.Tech CSE'28 , IIT (ISM) Dhanbad

*This project was built for learning and academic purposes.*

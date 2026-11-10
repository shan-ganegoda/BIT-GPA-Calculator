
# BIT GPA CALCULATOR

The University GPA Calculator Project is a web-based application developed by our team to assist students in calculating their Grade Point Average (GPA) at the university level. The tool simplifies the often complex and time-consuming process of manually computing GPA and provides students with a user-friendly interface to obtain accurate and instant results. This project was initiated in response to the growing need for an efficient GPA calculator to streamline academic planning and decision-making.


## Features

- GPA and progression rules from the BIT student handbooks 2022 to 2026
- Intake-year picker (2022, 2023, 2024, 2025, 2026/27) for the per-year course lists and rules
- Live level and cumulative GPA as you pick grades, with clear pass/fail checks
- Progress report with year, semester and per-course charts
- Grades are saved in your own browser only (Data Privacy)

The course data lives in `src/app/gpa/handbook.ts` and the rules in `src/app/gpa/gpa-engine.ts`.


## Tech Stack

Angular 22 (standalone components, signals, zoneless), Angular Material, Chart.js

## 🚀 About Team
Our team of dedicated and passionate university undergraduates came together with a shared vision to enhance our skills and unlock our full potential through a skill development project. Recognizing the importance of practical experience in complementing theoretical knowledge, we embarked on this journey to work collaboratively, explore new technologies, and create innovative solutions that add value to our academic and personal growth.


![Logo](https://cdn.icon-icons.com/icons2/2699/PNG/512/angular_logo_icon_169598.png)


## Run Locally

Clone the project

```bash
  git clone https://github.com/shan-ganegoda/BIT-GPA-Calculator.git
```

Go to the project directory

```bash
  cd BIT-GPA-Calculator
```

Install dependencies

```bash
  npm install
```

Start the server (needs Node 22.22.3+, 24.15+ or 26+; `.nvmrc` pins Node 24 LTS)

```bash
  npm start
```

Run the unit tests

```bash
  npm test
```


## Feedback

If you have any feedback, please mail out to me gglakshan@gmail.com


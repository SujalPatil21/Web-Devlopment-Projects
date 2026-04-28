# GATE 2026 Registration Form (Multi-Step Form Validation)

A fully functional **multi-step registration form** built using HTML, CSS, and JavaScript, designed to simulate a real-world **GATE 2026 application portal**.

The project focuses on **form validation, user experience, and structured data collection** across multiple steps.

---

## Features

- Multi-step form (Personal → Academic → Exam → Submit)
- Real-time input validation
- Dynamic progress bar with step tracking
- Error handling with field highlighting
- Photo upload with preview and size validation
- Automatic Application ID generation
- Smooth UI transitions and responsive design

---

## Technologies Used

- HTML5  
- CSS3  
- JavaScript (Vanilla JS)

---

## Project Structure
```
project-folder/
│
├── index.html
├── style.css
└── app.js
```


---

## How to Run

1. Download or clone the repository.
2. Ensure all files are in the same directory:
   - `index.html`
   - `style.css`
   - `app.js`
3. Open `index.html` in your browser.
4. Allow interactions and fill the form step-by-step.

---

## Form Workflow

### Step 1: Personal Information
- Name validation (alphabet only)
- DOB validation (age between 18–60)
- Email format validation
- Mobile number validation (10 digits)
- Aadhar validation (12 digits)

### Step 2: Academic Information
- Degree and branch selection
- College and roll number validation
- CGPA/percentage input validation

### Step 3: Exam Details
- GATE paper selection
- City preferences (must be different)
- Photo upload (max 200 KB)
- Declaration checkbox (mandatory)

### Step 4: Submission
- Generates a unique Application ID
- Displays success screen
- Option to reset and register again

---


## UI & Styling

The interface is styled using a modern UI system defined in CSS variables such as:

- Primary color system (`--accent`, `--accent2`)
- Input feedback states (valid / invalid)
- Responsive grid layout
- Card-based form design

Reference: :contentReference[oaicite:0]{index=0}

---

## Interface Preview

- Multi-step form with progress bar
- Clean card-based layout
- Live validation feedback
- Success screen with Application ID

Reference: :contentReference[oaicite:1]{index=1}

---

## Requirements

- Modern browser (Chrome recommended)
- JavaScript enabled

---

## Purpose

This project demonstrates:

- Frontend form validation logic
- Multi-step workflow implementation
- DOM manipulation and state handling
- Real-world application UI design
- Clean and structured JavaScript code

---

## Author

**Sujal Patil**

- Email: [sujalpatil21@gmail.com](mailto:sujalpatil21@gmail.com)
- GitHub: [SujalPatil21](https://github.com/SujalPatil21)

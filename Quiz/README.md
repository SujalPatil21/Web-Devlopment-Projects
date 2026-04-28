# Modern Quiz App – JavaScript Project

This project is a web-based quiz application built using HTML, CSS, and JavaScript.  
It allows users to register, attempt timed questions, and view their final score with performance feedback.

---

## Problem / Purpose

The goal of this project is to:

- Build an interactive quiz system  
- Implement real-time user interaction  
- Handle state management and timers  
- Practice DOM manipulation and validation  
- Simulate real-world frontend application logic  

---

## Core Features

- User Registration with validation  
- Timed quiz (15 seconds per question)  
- Dynamic question rendering  
- Score tracking system  
- Progress bar visualization  
- High score storage using LocalStorage  
- Final performance analysis  
- Restart functionality  

---

## Project Structure

```
Quiz-App/
│
├── index.html
├── style.css
└── script.js
```


---

## Code Overview

### 1. Question Data Structure

Questions are stored as objects:

```
{
question: "string",
options: ["A", "B", "C", "D"],
answer: index
}
```

---

### 2. State Management

The application maintains:

- `currentQuestionIndex` → tracks progress  
- `score` → stores user score  
- `selectedOption` → current choice  
- `timeRemaining` → countdown timer  
- `highScore` → stored in LocalStorage  

---

### 3. Core Logic

#### Quiz Flow

1. User registers  
2. Quiz starts  
3. Question loads dynamically  
4. Timer starts (15 sec)  
5. User selects answer  
6. Score updates  
7. Next question loads  
8. Final screen displays result  

---

### 4. Timer Logic

- Each question has a 15-second limit  
- Countdown handled using `setInterval`  
- Auto-submit when time reaches zero  

---

### 5. Answer Evaluation

- Correct answer → +10 points  
- Wrong answer → highlight correct option  
- Multiple selections prevented  

---

### 6. LocalStorage Usage

- Stores:
  - High Score  
  - Current user data  
- Ensures persistence across sessions  

---

## UI & Styling

- Clean card-based UI  
- Gradient-based theme  
- Responsive layout  
- Animated transitions  
- Interactive option highlighting  

---

## Screens

- Registration Screen  
- Quiz Screen  
- Result Screen  

---

## Validation Logic

- Name → required  
- Email → regex validation  
- Mobile → exactly 10 digits  

---

## Complexity

- Time Complexity: O(n)  
- Space Complexity: O(n)  

---

## Limitations

- No backend (client-side only)  
- Fixed question set  
- No user authentication security  
- Data stored only in browser  

---

## Future Improvements

- Backend integration (Node.js + database)  
- Randomized questions  
- Difficulty levels  
- Leaderboard system  
- API-based question loading  

---

## How to Run

1. Download the project  
2. Open `index.html` in a browser  
3. Enter user details  
4. Start quiz  

---

## Author

**Sujal Patil**

- GitHub: https://github.com/SujalPatil21  
- Email: sujalpatil21@gmail.com  

---
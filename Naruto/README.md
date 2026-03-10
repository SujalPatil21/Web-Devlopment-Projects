# Naruto Hand Tracking Effects

A browser-based hand tracking project built using MediaPipe Hands, where opening your hands triggers Naruto and Sasuke power effects in real time.

This project uses your webcam to detect hand landmarks and overlays animated visual effects based on hand gestures.

---
## Website 

https://sujalpatil21.github.io/Web-Devlopment-Projects/Naruto/
## Features

- Real-time hand tracking using MediaPipe
- Bright blue hand skeleton visualization
- Gesture-based activation
- Smooth power fade-in and fade-out effect
- Dual-hand detection support

---

## Controls

- Right Hand Open: Activates Sasuke power
- Left Hand Open: Activates Naruto power
- Blue Skeleton Overlay: Shows hand tracking detection status

---

## Technologies Used

- HTML5
- CSS3
- JavaScript
- MediaPipe Hands API
- MediaPipe Camera Utilities

---

## Project Structure

```
project-folder/
│
├── index.html
└── assets/
├── naruto.mp4
└── sasuke.mp4
```

---

## How to Run

1. Clone or download the repository.
2. Ensure the `assets` folder contains:
   - `naruto.mp4`
   - `sasuke.mp4`
3. Open `index.html` in a modern browser (Chrome recommended).
4. Allow camera permissions when prompted.

---

## How It Works

- MediaPipe detects up to two hands.
- A custom function determines whether the hand is open.
- If open:
  - The corresponding power video plays.
  - Opacity increases based on gesture duration.
- If closed:
  - The power fades out smoothly.
- Hand landmarks are drawn with glowing blue connectors.

---

## Requirements

- Webcam access
- Modern browser (Chrome or Edge recommended)
- Internet connection (for MediaPipe CDN loading)

---

## Purpose

This project demonstrates:
- Real-time computer vision in the browser
- Gesture-based interaction
- Creative visual effects integration
- Practical use of JavaScript with MediaPipe

---

## Author

**Sujal Patil**

- Email: [sujalpatil21@gmail.com](mailto:sujalpatil21@gmail.com)
- GitHub: [SujalPatil21](https://github.com/SujalPatil21)

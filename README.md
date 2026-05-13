# Work/Rest Session Timer

A lightweight, browser-based timer designed to structure work and rest periods efficiently. Perfect for productivity sessions, Pomodoro-style workflows, or any routine that benefits from timed work and breaks.  

This timer includes:  

- **Customizable session durations** – set total session length, work periods, and rest periods.  
- **Voice guidance** – spoken cues for session events, powered by ElevenLabs’ Eleven Multilingual v2 voice model (Alice).  
- **Music and bell cues** – optional background music and minute bells for work and rest phases.  
- **Progress visualization** – phase and total session timers with progress bars.  
- **Offline support** – service worker enables caching of assets for offline use.  
- **NoSleep integration** – prevents the screen from going to sleep during sessions.  

## Live Demo

[Try it in your browser](https://beauterre.github.io/work-rest-timer/)

## Setup

Clone or download the repository, then open `index.html` in a browser. For full offline support, serve it via a local server (e.g., XAMPP, Live Server, or Python's `http.server`).  

## Voice Model

The timer’s voice guidance uses **Alice**, powered by ElevenLabs’ **Eleven Multilingual v2** model.

## License

[MIT License](LICENSE)

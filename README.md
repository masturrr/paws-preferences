Objectives

This project was built for a technical assessment with the following goals:
	•	Single-page web application.
	•	Swipe-based like/dislike interactions.
	•	Use the Cataas API (https://cataas.com) for all cat images.
	•	Provide a smooth, intuitive experience on mobile devices.
	•	Show a summary screen listing all liked cats once the stack is finished.

⸻

Features
	•	Swipe gestures (touch + mouse)
	•	Drag a card left/right to decide.
	•	Release to animate the card off-screen and move to the next cat.
	•	Like / Dislike buttons
	•	Large round buttons mirror the swipe behaviour for accessibility and desktop use.
	•	Progress indicator
	•	Shows current position in the stack: current / total.
	•	Summary screen
	•	Displays total number of liked cats.
	•	Renders a responsive grid of all liked cat images.
	•	Responsive, mobile-first UI
	•	Layout and typography optimised for small screens.
	•	Works well on desktop and tablet, too.
	•	Lightweight stack
	•	Pure HTML + CSS + vanilla JavaScript, no external frameworks.

⸻

Tech Stack
	•	HTML5 – Base structure for the app and UI regions.
	•	CSS3 – Flexbox layout, card stack styling, animations, and responsive design.
	•	JavaScript (ES6) – Swipe handling, state management, DOM updates.
	•	Cataas API – All images are loaded from https://cataas.com.

⸻

Architecture & Design

Data source
	•	A fixed list of cat image URLs is generated using Cataas’ random endpoint.
	•	For the assessment, the app assumes a fixed number of pictures (e.g. 12).

State management
	•	urls – list of image URLs.
	•	index – current position in the stack.
	•	liked – array of URLs the user liked.

All state is kept in memory only; no backend or local storage is used.

Swipe interaction
	•	Pointer/touch events are used to:
	•	Track drag offset.
	•	Apply CSS transforms (translate + rotate) in real time.
	•	If the release distance passes a threshold, the card:
	•	Animates off-screen.
	•	Is classified as liked or disliked depending on direction.
	•	If the threshold isn’t reached, the card snaps back into place.

Accessibility & UX choices
	•	Large, high-contrast buttons with clear emoji icons.
	•	aria-live region for progress updates.
	•	Summary screen shows a clear message of the result and offers a “Start again” action.
	•	Mobile-first design with max-width wrapper so the layout remains readable on wider screens.

Getting Started

1. Clone the repository
     git clone https://github.com/YOUR-GITHUB-USERNAME/paws-preferences.git
     cd paws-preferences
   Possible Improvements / Future Work

If I had more time, I’d like to:
	•	Add keyboard controls (← / → arrows for like/dislike).
	•	Use Cataas tags (e.g. “cute”, “sleepy”) so users can choose cat categories.
	•	Introduce basic image preloading and skeleton loading for even smoother transitions.
	•	Persist liked cats using localStorage.
	•	Add simple analytics (e.g. percentage of liked cats, “You tend to like X% of cats”).

⸻

Acknowledgements
	•	Cat images provided by Cataas – Cat as a Service.
	•	Assessment brief: “Paws & Preferences: Find Your Favourite Kitty”.

# Discovery Call Guide

Static, no-build web app for running discovery calls: pick a call type, tick off 7 questions, take notes, track time, copy notes out.

Reconstruction of https://guide-site-kv5i.vercel.app/ (the original source was not available, so the 7 questions in `questions.js` are placeholders).

## Run
Open `index.html`, or `npx serve .`

## Deploy
`vercel --prod` (static, no config needed).

## Files
- `index.html` markup and styles
- `questions.js` question content per call type (edit this)
- `app.js` behavior; state persists in localStorage

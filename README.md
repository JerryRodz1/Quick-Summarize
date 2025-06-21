# QuickGist Chrome Extension

QuickGist is a Chrome extension that uses OpenAI’s GPT API to summarize web page content quickly and easily. Customize the tone and summary length, then listen to the summary with built-in text-to-speech.

## Features

- Summarize any webpage text with a click  
- Choose tone: Neutral, Friendly, Professional, etc.  
- Adjust word limit for concise or detailed summaries  
- Copy summary to clipboard  
- Save and download summaries as text files  
- Listen to summaries with natural text-to-speech voices

## Installation

1. Clone or download this repo to your local machine.  
2. Open Chrome and go to `chrome://extensions/`  
3. Enable **Developer mode** (top right toggle)  
4. Click **Load unpacked** and select the project folder.  
5. IMPORTANT: Add your own OpenAI API key in `popup.js` at the top:  
   ```js
   const API_KEY = "YOUR_OPENAI_API_KEY_HERE";

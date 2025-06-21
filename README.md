# Quick Summarize — Chrome Extension

Quick Summarize is a Chrome extension that uses OpenAI's GPT to quickly summarize webpage content in a tone and length you choose — with optional text-to-speech reading and dark mode.

---

## Features

- Summarize any webpage text instantly  
- Choose tone (neutral, funny, professional, etc.)  
- Adjust word count limit for summary length  
- Read summary aloud with natural-sounding voice  
- Save and download summaries  
- Dark mode toggle for comfortable reading  

---

## Installation

### From GitHub (Developer Mode)

1. Clone or download this repo to your computer.  
2. Open Chrome and go to `chrome://extensions/`  
3. Enable **Developer mode** (top right)  
4. Click **Load unpacked** and select the extension folder  
5. The Quick Summarize icon should appear in your toolbar  

### Note on API Key

This extension requires an OpenAI API key. To keep your key private:

- Create a file named `config.js` with the following line (replace with your API key):  
  ```js
  const API_KEY = "your-openai-api-key-here";

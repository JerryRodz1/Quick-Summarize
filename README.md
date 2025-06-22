# QuickSummarize Chrome Extension

QuickSummarize is a lightweight Chrome extension that uses OpenAI’s GPT-3.5 API to instantly summarize any webpage content. Customize the tone and length of your summaries, listen to them via text-to-speech, and save or download for easy reference.

---

# Features

- **Instant Summaries**: Summarize the current page text with one click.
- **Tone Selection**: Choose from multiple tones such as Neutral, Formal, Friendly, etc.
- **Adjustable Summary Length**: Use the slider to set your desired summary word count.
- **Dark Mode**: Toggle between light and dark themes for comfortable reading.
- **Text-to-Speech**: Listen to summaries read aloud in a natural voice.
- **Save & Download**: Save your last summary locally or download it as a `.txt` file.
- **Copy to Clipboard**: Quickly copy summaries to share or use elsewhere.

---

## Installation

### For Developers / Advanced Users

1. Clone or download this repository.
2. Open `chrome://extensions/` in your Chrome browser.
3. Enable **Developer mode** (toggle top-right).
4. Click **Load unpacked** and select the extension folder.
5. IMPORTANT: Add your OpenAI API key in `config.js` (or directly in `popup.js` if you prefer).
   
   **Do NOT commit your API key to public repos.** Use environment variables or `.gitignore` to keep it private.

---

## Usage

1. Click the QuickSummarize icon in the toolbar.
2. Select your preferred tone and summary length.
3. Click **Summarize** to generate a summary of the active tab’s text.
4. Use the buttons to copy, save, download, or listen to your summary.
5. Toggle dark mode for a comfortable viewing experience.

---

## Configuration

- **API Key**: The extension requires an OpenAI API key to work. Store it securely and avoid pushing it publicly.
- **Max Text Limit**: The extension sends up to 3000 characters from the page to the API to ensure performance.

---

## Contributing

Feel free to fork the repo, open issues, or submit pull requests to improve QuickSummarize!

---

## Acknowledgments

- OpenAI for providing the GPT-3.5 API.
- Chrome Extensions documentation for comprehensive guides.
- Inspiration from community-driven Chrome extension projects.

---

## Contact

For questions or feedback, reach out at [Jerryrodriguezz111@gmail.com] or open an issue here on GitHub.

---

**Enjoy summarizing smarter! 🚀**

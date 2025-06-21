const API_KEY = "YOUR_API_KEY_HERE"; 

console.log("popup.js loaded");

const summarizeBtn = document.getElementById("summarize");
const summaryDiv = document.getElementById("summary");
const loadingDiv = document.getElementById("loading");

const toneSelect = document.getElementById("toneSelect");
const wordLimitSlider = document.getElementById("wordLimit");
const wordCountSpan = document.getElementById("wordCount");

const copyBtn = document.getElementById("copyBtn");
const copyMsg = document.getElementById("copyMsg");

const saveBtn = document.getElementById("saveBtn");
const downloadBtn = document.getElementById("downloadBtn");
const saveMsg = document.getElementById("saveMsg");

const readBtn = document.getElementById("readBtn");

// Update word count display on slider move
wordLimitSlider.addEventListener("input", () => {
  wordCountSpan.innerText = wordLimitSlider.value;
});

// Load saved summary on popup load
window.onload = () => {
  chrome.storage.local.get("lastSummary", (data) => {
    if (data.lastSummary) {
      summaryDiv.innerText = data.lastSummary;
    }
  });
};

// Summarize page content
summarizeBtn.addEventListener("click", async () => {
  summaryDiv.innerText = "";
  loadingDiv.style.display = "block";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: () => document.body.innerText,
    },
    async (results) => {
      const pageText = results[0].result;
      const tone = toneSelect.value;
      const wordLimit = wordLimitSlider.value;

      const summary = await getSummary(pageText, tone, wordLimit);
      summaryDiv.innerText = summary;
      loadingDiv.style.display = "none";
    }
  );
});

// Copy summary to clipboard
copyBtn.addEventListener("click", () => {
  const summaryText = summaryDiv.innerText;
  if (!summaryText) return;

  navigator.clipboard.writeText(summaryText).then(() => {
    copyMsg.style.display = "block";
    setTimeout(() => (copyMsg.style.display = "none"), 2000);
  });
});

// Save summary locally
saveBtn.addEventListener("click", () => {
  const summaryText = summaryDiv.innerText;
  if (!summaryText) return;

  chrome.storage.local.set({ lastSummary: summaryText }, () => {
    saveMsg.style.display = "block";
    setTimeout(() => (saveMsg.style.display = "none"), 2000);
  });
});

// Download summary as a text file
downloadBtn.addEventListener("click", () => {
  const summaryText = summaryDiv.innerText;
  if (!summaryText) return;

  const blob = new Blob([summaryText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "summary.txt";
  a.click();
  URL.revokeObjectURL(url);
});

// Text-to-speech with more natural tone
readBtn.addEventListener("click", () => {
    const summaryText = summaryDiv.innerText;
    if (!summaryText) return;
  
    window.speechSynthesis.cancel();
  
    const utterance = new SpeechSynthesisUtterance(summaryText);
  
    const voices = window.speechSynthesis.getVoices();
  
    const selectedVoice =
      voices.find(v => v.name === "Samantha") ||
      voices.find(v => v.name === "Alex") ||
      voices.find(v => v.lang === "en-US") ||
      voices[0];
  
    if (selectedVoice) utterance.voice = selectedVoice;
  
    utterance.pitch = 0.9;  // slightly lower pitch for naturalness
    utterance.rate = 0.8;   // slower rate for clarity
  
    window.speechSynthesis.speak(utterance);
  });
  

// Sometimes voices load late — log when they load (optional)
window.speechSynthesis.onvoiceschanged = () => {
  console.log("Voices loaded:", window.speechSynthesis.getVoices());
};

// Function to call OpenAI API and get summary
async function getSummary(text, tone = "neutral", wordLimit = 50) {
  const prompt = `Summarize the following page content in a ${tone} tone and limit it to approximately ${wordLimit} words:\n\n${text.substring(0, 3000)}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      return `API error: ${errorDetails.error.message}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No summary returned.";
  } catch (err) {
    return `Fetch error: ${err.message}`;
  }
}

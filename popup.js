console.log("popup.js loaded");

const summarizeBtn = document.getElementById("summarize");
const summaryDiv = document.getElementById("summary");
const loadingDiv = document.getElementById("loading");

const copyBtn = document.getElementById("copyBtn");
const copyMsg = document.getElementById("copyMsg");

const toneSelect = document.getElementById("toneSelect");
const wordLimitSlider = document.getElementById("wordLimit");
const wordCountSpan = document.getElementById("wordCount");

const saveBtn = document.getElementById("saveBtn");
const downloadBtn = document.getElementById("downloadBtn");
const saveMsg = document.getElementById("saveMsg");

const darkModeToggle = document.getElementById("darkModeToggle");
const readAloudBtn = document.getElementById("readAloudBtn");

function typeSummary(text, targetDiv) {
  targetDiv.innerText = "";
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      targetDiv.innerText += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, 15);
}

wordLimitSlider.addEventListener("input", () => {
  wordCountSpan.innerText = wordLimitSlider.value;
});

summarizeBtn.addEventListener("click", async () => {
  summaryDiv.innerText = "";
  loadingDiv.style.display = "block";
  summarizeBtn.disabled = true;

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

      loadingDiv.style.display = "none";
      summarizeBtn.disabled = false;
      typeSummary(summary, summaryDiv);
    }
  );
});

copyBtn.addEventListener("click", () => {
  const text = summaryDiv.innerText;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    copyMsg.style.display = "block";
    setTimeout(() => (copyMsg.style.display = "none"), 2000);
  });
});

saveBtn.addEventListener("click", () => {
  const text = summaryDiv.innerText;
  if (!text) return;
  chrome.storage.local.set({ lastSummary: text }, () => {
    saveMsg.style.display = "block";
    setTimeout(() => (saveMsg.style.display = "none"), 2000);
  });
});

downloadBtn.addEventListener("click", () => {
  const text = summaryDiv.innerText;
  if (!text) return;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "summary.txt";
  a.click();
  URL.revokeObjectURL(url);
});

readAloudBtn.addEventListener("click", () => {
  const text = summaryDiv.innerText;
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const siriVoice = voices.find(
    (v) => v.name.includes("Samantha") || v.name.includes("Siri") || v.lang === "en-US"
  );
  if (siriVoice) utterance.voice = siriVoice;
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
});

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark");
    chrome.storage.local.set({ darkMode: true });
  } else {
    document.body.classList.remove("dark");
    chrome.storage.local.set({ darkMode: false });
  }
});

window.onload = () => {
  chrome.storage.local.get(["lastSummary", "darkMode"], (data) => {
    if (data.lastSummary) summaryDiv.innerText = data.lastSummary;
    if (data.darkMode) {
      document.body.classList.add("dark");
      darkModeToggle.checked = true;
    }
  });
};

async function getSummary(text, tone = "neutral", wordLimit = 50) {
  const prompt = `Summarize this in a ${tone} tone in about ${wordLimit} words:\n\n${text.substring(0, 3000)}`;
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
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("API error:", err);
      return `API error: ${err.error.message}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No summary returned.";
  } catch (error) {
    console.error("Fetch error:", error);
    return `Fetch error: ${error.message}`;
  }
}

/**
 * SlimedOut — Background Service Worker
 * Bypasses restrictive Content Security Policies on target websites
 * to make external API calls (e.g. Gemini AI).
 */

importScripts('config.js');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'FETCH_GEMINI') {
    const apiKey = self.CONFIG?.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      sendResponse({ error: "Gemini API key is missing. Add it to config.js." });
      return true;
    }

    const { opponent } = request.payload;

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an announcer analyzing an opponent for a coding duel. Generate fun, aggressive stats (e.g. 'Code Quality: 90%') and a short hype text based on this LinkedIn profile info: Name="${opponent?.name}", Headline="${opponent?.headline}". Do NOT generate any images, markdown blocks, or long paragraphs. Keep it to max 4 punchy lines.`
          }]
        }]
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        sendResponse({ success: true, text: data.candidates[0].content.parts[0].text });
      } else {
        sendResponse({ success: false, error: 'Unreadable opponent data' });
      }
    })
    .catch(err => {
      console.error('Gemini error:', err);
      sendResponse({ success: false, error: 'Network fetch failed.' });
    });

    return true; // Keep message channel open for async response
  }
});

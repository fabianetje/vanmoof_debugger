const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const loader = document.getElementById("loader");

async function getBotResponse(message) {
  loader.classList.remove("hidden");

  const faqText = await fetch("faq.txt").then(res => res.text());

  const prompt = `
Je bent een behulpzame AI assistent gespecialiseerd in VanMoof fietsen.
Gebruik deze extra info indien nodig:\n\n${faqText}

Gebruiker zegt: "${message}"
Antwoord met een tip of diagnose.
`;

  const response = await fetch("https://api.aiproxy.io/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "Je helpt mensen met VanMoof fietsproblemen." },
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo"
    })
  });

  const data = await response.json();
  loader.classList.add("hidden");
  return data.choices?.[0]?.message?.content || "Sorry, ik weet het even niet.";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  chat.innerHTML += `<div class="message user">${userMessage}</div>`;
  input.value = "";

  const botReply = await getBotResponse(userMessage);
  chat.innerHTML += `<div class="message bot">${botReply}</div>`;
  chat.scrollTop = chat.scrollHeight;
});

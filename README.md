# Houston: Mission Control Terminal

<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/1ef24c71-f0b0-4708-a0cc-143dd29a1362" />


I built Houston for an assignment that asked us to create a purpose-built chatbot, rather than just another generic AI wrapper. 

Most AI apps today look exactly the same, a clean white screen with a chat box at the bottom. I decided to go in the exact opposite direction. I chose **Space Exploration** as my topic because it perfectly fits an old-school, retro-terminal aesthetic. 

The goal was to make the user feel like they are sitting at a 1970s NASA mission control desk, talking to a strict communications AI (CAPCOM).

## Frontend Thinking & UX Details

The assignment wasn't just about plugging into an AI API; it was about the frontend experience. Here's what I focused on to make it feel real:

### Visual Identity
- **Pure CSS:** No heavy images are used. The cool radar grid background on the home screen is actually just pure CSS linear gradients and masks, keeping the app incredibly fast.
- **Typography:** I used fonts like `Share Tech Mono` and `Orbitron` coupled with a subtle green CRT glow and a blinking cursor to nail the retro terminal vibe.

### Smart Session History
- **Persistent Memory:** I built a custom sidebar that saves your chat history to `localStorage` so you don't lose your work when you close the tab.
- **Cinematic Loading:** To keep the home page looking dramatic, the sidebar hides itself automatically until you start a chat, at which point it slides in seamlessly. It also auto-generates titles for your chats based on your first message.

### Frictionless UX
- **Auto-Focus:** There's nothing more annoying than having to click the input box again after every message. I added an auto-focus loop so the moment the AI finishes typing, your cursor is right back in the input box ready for your next command.
- **Hidden Copy Buttons:** Instead of cluttering the UI, little `[ COPY DATA ]` buttons quietly fade in only when you hover over a message, making it easy to copy math or orbit info.
- **In-Character Errors:** If the API fails or you lose internet, you won't see a standard "500 Server Error". Instead, the terminal prints an integrated red warning: `⚠ TRANSMISSION ERROR: Unable to establish uplink with AI core.` protecting the immersion.

### The CAPCOM Persona
Houston isn't ChatGPT. I gave the AI a very strict system prompt. It refuses to do sci-fi roleplay, won't write code for you, and won't talk about pop culture. It also refuses to use standard markdown (like bolding or headers) so the text always looks like raw, uniform terminal output.

## Tech Stack

- **Next.js & Tailwind CSS:** For the core app and styling.
- **Groq API (Llama 3.3):** I specifically chose Groq instead of OpenAI because Groq is unbelievably fast. Watching the text stream in at hundreds of tokens a second really sells the "live terminal data link" effect.
- **Fallback Routing:** If the main Llama 3.3 model hits a rate limit, the API route silently falls back to Llama 3.1 or DeepSeek to keep the app working without breaking the user experience.

## Getting Started

To run this locally:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file at the root of the project and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) and start typing!

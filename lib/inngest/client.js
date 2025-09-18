import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "sarthi" , name: "Sarthi" , credentials: {
    gemini: {
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    },
  }, });

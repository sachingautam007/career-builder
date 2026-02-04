import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "nextstep.ai", // Unique app ID
  name: "NextStep AI", // Descriptive app name
  description: "Automating workflows with AI", // App description
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
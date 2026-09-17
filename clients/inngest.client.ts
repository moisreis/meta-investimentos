import "dotenv/config"
import { Inngest } from "inngest"

// Configures the application Inngest client.
export const inngest = new Inngest({
  id: "meta-investimentos",
  eventKey: process.env.INNGEST_EVENT_KEY,
})

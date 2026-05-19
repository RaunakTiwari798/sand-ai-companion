import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const InsightSchema = z.object({
  title: z.string(),
  author: z.string(),
  oneLiner: z.string(),
  summary: z.string(),
  themes: z.array(z.string()).max(6),
  keyTakeaways: z.array(z.string()).max(6),
  notableQuotes: z.array(z.string()).max(4),
  conclusion: z.string(),
  readIf: z.string(),
});

export const Route = createFileRoute("/api/book")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as { book?: string };
        const book = (body.book ?? "").trim();
        if (!book || book.length > 200) {
          return new Response("Invalid book name", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        try {
          const { experimental_output: output } = await generateText({
            model,
            experimental_output: Output.object({ schema: InsightSchema }),
            prompt: `Provide a structured insight for the book: "${book}". If you cannot identify the book confidently, infer best-known match. Fill every field with substance — no placeholders.`,
          });
          return Response.json(output);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "AI error";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});

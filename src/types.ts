import { z } from "zod";

// Schema for input props — validated at render time
export const JigiPromoSchema = z.object({
  // === AI-generated assets (URLs from fal.ai, ElevenLabs, imgBB) ===
  backgroundImageUrl: z
    .string()
    .optional()
    .describe("Flux Pro image URL — used as background on hook + transition scenes"),
  brollVideoUrl: z
    .string()
    .optional()
    .describe("Kling 2.6 video clip URL — plays as B-roll behind the demo scene"),
  voiceoverUrl: z
    .string()
    .optional()
    .describe("ElevenLabs MP3 URL — narration synced across all scenes"),

  // === Claude-generated text content ===
  hookGreeting: z.string().default("I ni ce !"),
  hookQuestion: z
    .string()
    .default("Tu perds une demi-journée pour voir un médecin ?"),
  statNumber: z.number().default(81),
  statUnit: z.string().default("%"),
  statLabel: z.string().default("des Maliens renoncent aux soins"),
  statSublabel: z.string().default("à cause du coût et du temps"),
  transitionText: z
    .string()
    .default("Et si tu pouvais consulter depuis chez toi ?"),
  chatMessages: z
    .array(
      z.object({
        type: z.enum(["bot", "user"]),
        text: z.string(),
        delay: z.number(),
      })
    )
    .default([
      { type: "bot", text: "I ni ce ! Je suis NYELE, votre assistante santé.", delay: 0 },
      { type: "bot", text: "Décrivez-moi vos symptômes par la voix 🎙️", delay: 30 },
      { type: "user", text: "Mon enfant a de la fièvre depuis 2 jours...", delay: 70 },
      { type: "bot", text: "Je comprends. Quelques questions pour mieux vous aider :", delay: 110 },
      { type: "bot", text: "→ La fièvre est-elle au-dessus de 39°C ?\n→ Y a-t-il des vomissements ?\n→ L'enfant mange-t-il normalement ?", delay: 140 },
      { type: "bot", text: "✅ Bilan prêt ! Je recommande une consultation médecin.", delay: 185 },
    ]),
  prixFree: z.string().default("GRATUIT"),
  prixFreeLabel: z.string().default("3 premières consultations IA"),
  prixAmount: z.string().default("1 500 CFA"),
  prixLabel: z.string().default("consultation avec un vrai médecin"),
  prixComparison: z
    .string()
    .default("vs 15 000 CFA + demi-journée en clinique"),
  ctaText: z.string().default("Téléchargez JIGI"),
  ctaTagline: z.string().default("Votre santé, votre choix."),
  hashtags: z.string().default("#JIGIHealth #SantéMali #SantéPourTous"),

  // === Subtitles track (from voiceover transcript) ===
  subtitles: z
    .array(
      z.object({
        text: z.string(),
        startFrame: z.number(),
        endFrame: z.number(),
      })
    )
    .optional()
    .describe("Timed subtitle entries — synced with voiceover"),

  // === Overlay toggles ===
  showWatermark: z.boolean().default(true),
  showSubtitles: z.boolean().default(true),
  showTerracottaBar: z.boolean().default(true),
});

export type JigiPromoProps = z.infer<typeof JigiPromoSchema>;

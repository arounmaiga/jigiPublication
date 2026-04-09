import { Composition } from "remotion";
import { JigiPromo } from "./JigiPromo";
import { JigiPromoSchema } from "./types";
import { AminataTestimonial } from "./AminataTestimonial";
import { DynamicPost } from "./DynamicPost";
import { FPS, WIDTH, HEIGHT, TOTAL_FRAMES } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main composition — accepts assets from fal.ai, ElevenLabs, Claude */}
      <Composition
        id="JigiPromo"
        component={JigiPromo}
        schema={JigiPromoSchema}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          // No external assets — uses built-in React mockups
          hookGreeting: "I ni ce !",
          hookQuestion: "Tu perds une demi-journée pour voir un médecin ?",
          statNumber: 81,
          statUnit: "%",
          statLabel: "des Maliens renoncent aux soins",
          statSublabel: "à cause du coût et du temps",
          transitionText: "Et si tu pouvais consulter depuis chez toi ?",
          chatMessages: [
            { type: "bot", text: "I ni ce ! Je suis NYELE, votre assistante santé.", delay: 0 },
            { type: "bot", text: "Décrivez-moi vos symptômes par la voix 🎙️", delay: 30 },
            { type: "user", text: "Mon enfant a de la fièvre depuis 2 jours...", delay: 70 },
            { type: "bot", text: "Je comprends. Quelques questions pour mieux vous aider :", delay: 110 },
            { type: "bot", text: "→ La fièvre est-elle au-dessus de 39°C ?\n→ Y a-t-il des vomissements ?\n→ L'enfant mange-t-il normalement ?", delay: 140 },
            { type: "bot", text: "✅ Bilan prêt ! Je recommande une consultation médecin.", delay: 185 },
          ],
          prixFree: "GRATUIT",
          prixFreeLabel: "3 premières consultations IA",
          prixAmount: "1 500 CFA",
          prixLabel: "consultation avec un vrai médecin",
          prixComparison: "vs 15 000 CFA + demi-journée en clinique",
          ctaText: "Téléchargez JIGI",
          ctaTagline: "Votre santé, votre choix.",
          hashtags: "#JIGIHealth #SantéMali #SantéPourTous",
          showWatermark: true,
          showSubtitles: true,
          showTerracottaBar: true,
        }}
      />
      {/* Aminata Testimonial — storytelling promo */}
      <Composition
        id="AminataTestimonial"
        component={AminataTestimonial}
        durationInFrames={31 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* Dynamic Post — driven by n8n pipeline props */}
      <Composition
        id="DynamicPost"
        component={DynamicPost}
        durationInFrames={30 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          imageUrls: [],
          audioUrl: "",
          backgroundMusicUrl: "https://files.catbox.moe/0qxh0p.mp3",
          subtitles: ["JIGI. La sante pour tous."],
          durationInSeconds: 30,
          hookTitle: "JIGI",
          persona: "Aminata",
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil((props.durationInSeconds || 30) * FPS),
        })}
      />
    </>
  );
};

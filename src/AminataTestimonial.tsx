import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const COLORS = {
  violet: "#3D1B5C",
  terracotta: "#C85A3A",
  cream: "#FFF8F0",
  teal: "#D4F0EC",
  dark: "#1A1A2E",
  white: "#FFFFFF",
};

const FPS = 30;

// Images fal.ai Flux Pro
const IMAGES = {
  aminataWorried: "https://v3b.fal.media/files/b/0a959a8c/zZjIw0Q7ocJ0iI1LOirok.jpg",
  cliniqueBondee: "https://v3b.fal.media/files/b/0a959a8c/5o6Oq0ArhvXlcBOwtYvXu.jpg",
  femmePhone: "https://v3b.fal.media/files/b/0a959a8d/CaDbkVrArQvqVwXE_hY6j.jpg",
  aminataHappy: "https://v3b.fal.media/files/b/0a959a8e/BAuzcO5euUt-_yZSJh7vm.jpg",
};

// Ken Burns effect on images
const KenBurns: React.FC<{
  src: string;
  startScale?: number;
  endScale?: number;
  brightness?: number;
}> = ({ src, startScale = 1.0, endScale = 1.15, brightness = 0.45 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [startScale, endScale], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          filter: `brightness(${brightness})`,
        }}
      />
    </AbsoluteFill>
  );
};

// Subtitle bar (no emojis, clean text)
const Subtitle: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const opacity = interpolate(localFrame, [0, 6, 80, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideY = interpolate(
    spring({ frame: localFrame, fps, config: { damping: 15, stiffness: 120 } }),
    [0, 1],
    [20, 0]
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 180,
        left: 40,
        right: 40,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          padding: "20px 36px",
          borderRadius: 16,
          maxWidth: "92%",
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: COLORS.white,
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
            lineHeight: 1.4,
            display: "block",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

// ============ SCENE 1: Aminata au marché, inquiète (0-5s) ============
const SceneProbleme: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nameOpacity = interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" });
  const nameY = interpolate(
    spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 80 } }),
    [0, 1],
    [30, 0]
  );

  return (
    <AbsoluteFill>
      <KenBurns src={IMAGES.aminataWorried} startScale={1.0} endScale={1.12} brightness={0.5} />

      {/* Name overlay */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: `${COLORS.dark}cc`,
            padding: "16px 40px",
            borderRadius: 16,
            borderLeft: `5px solid ${COLORS.terracotta}`,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: COLORS.cream,
              fontFamily: "Arial, sans-serif",
            }}
          >
            Aminata, 34 ans
          </span>
          <br />
          <span
            style={{
              fontSize: 32,
              color: `${COLORS.cream}bb`,
              fontFamily: "Arial, sans-serif",
            }}
          >
            Commerçante — Marché Dibida, Bamako
          </span>
        </div>
      </div>

      <Subtitle
        text="Chaque fois que mon fils est malade, je perds une demi-journée de vente..."
        delay={30}
      />
    </AbsoluteFill>
  );
};

// ============ SCENE 2: La galère clinique (5-9s) ============
const SceneClinique: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { text: "3h d'attente", delay: 10 },
    { text: "15 000 CFA la visite", delay: 30 },
    { text: "Un assistant, pas un médecin", delay: 50 },
  ];

  return (
    <AbsoluteFill>
      <KenBurns src={IMAGES.cliniqueBondee} startScale={1.05} endScale={1.18} brightness={0.35} />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: COLORS.terracotta,
            fontFamily: "Arial, sans-serif",
            textShadow: "0 3px 15px rgba(0,0,0,0.8)",
          }}
        >
          La réalité à Bamako
        </span>
      </div>

      {/* Pain points */}
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {items.map((item, i) => {
          const localFrame = frame - item.delay;
          if (localFrame < 0) return <div key={i} style={{ height: 75 }} />;

          const slideX = interpolate(
            spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 100 } }),
            [0, 1],
            [-400, 0]
          );
          const opacity = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                transform: `translateX(${slideX}px)`,
                opacity,
                backgroundColor: `${COLORS.dark}dd`,
                padding: "20px 28px",
                borderRadius: 16,
                borderLeft: `5px solid ${COLORS.terracotta}`,
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  color: COLORS.cream,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      <Subtitle
        text="La clinique... trois heures, quinze mille francs, et on voit même pas un vrai docteur."
        delay={5}
      />
    </AbsoluteFill>
  );
};

// ============ SCENE 3: Découverte JIGI — femme sur téléphone (9-13s) ============
const SceneDecouverte: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const jigiScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  const quoteOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <KenBurns src={IMAGES.femmePhone} startScale={1.0} endScale={1.1} brightness={0.4} />

      {/* "Ma voisine m'a dit..." */}
      <div
        style={{
          position: "absolute",
          top: 350,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: quoteOpacity,
          padding: "0 50px",
        }}
      >
        <span
          style={{
            fontSize: 50,
            fontWeight: 600,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            textShadow: "0 3px 15px rgba(0,0,0,0.8)",
            fontStyle: "italic",
            lineHeight: 1.4,
          }}
        >
          "Ma voisine m'a dit : essaie JIGI"
        </span>
      </div>

      {/* JIGI reveal */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ transform: `scale(${jigiScale})`, textAlign: "center" }}>
          <span
            style={{
              fontSize: 130,
              fontWeight: 900,
              color: COLORS.cream,
              fontFamily: "Arial, sans-serif",
              letterSpacing: 10,
              textShadow: `0 0 50px ${COLORS.violet}, 0 4px 20px rgba(0,0,0,0.7)`,
            }}
          >
            JIGI
          </span>
        </div>
      </div>

      <Subtitle
        text="J'ai parlé des signes de mon fils, en quinze minutes le docteur m'a répondu."
        delay={30}
      />
    </AbsoluteFill>
  );
};

// ============ SCENE 4: Le résultat — 3h vs 15min (13-16s) ============
const SceneResultat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const comparisonOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  const priceOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <KenBurns src={IMAGES.aminataHappy} startScale={1.0} endScale={1.1} brightness={0.4} />

      {/* Time comparison */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          opacity: comparisonOpacity,
        }}
      >
        <div
          style={{
            textAlign: "center",
            backgroundColor: `${COLORS.dark}cc`,
            padding: "20px 36px",
            borderRadius: 20,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: COLORS.terracotta,
              fontFamily: "Arial",
              textDecoration: "line-through",
            }}
          >
            3h
          </span>
          <br />
          <span style={{ fontSize: 28, color: `${COLORS.cream}99`, fontFamily: "Arial" }}>
            clinique
          </span>
        </div>

        <span
          style={{
            fontSize: 50,
            color: COLORS.cream,
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          {"\u2192"}
        </span>

        <div
          style={{
            textAlign: "center",
            backgroundColor: `${COLORS.dark}cc`,
            padding: "20px 36px",
            borderRadius: 20,
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 800, color: COLORS.teal, fontFamily: "Arial" }}>
            15 min
          </span>
          <br />
          <span style={{ fontSize: 28, color: `${COLORS.cream}99`, fontFamily: "Arial" }}>
            JIGI
          </span>
        </div>
      </div>

      {/* Price */}
      <div
        style={{
          position: "absolute",
          bottom: 400,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          alignItems: "center",
          opacity: priceOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.teal,
            padding: "16px 36px",
            borderRadius: 20,
          }}
        >
          <span
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: COLORS.violet,
              fontFamily: "Arial",
            }}
          >
            1 500 CFA
          </span>
        </div>
        <span
          style={{
            fontSize: 32,
            color: COLORS.cream,
            fontFamily: "Arial",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          au lieu de 15 000
        </span>
      </div>

      <Subtitle text="Je n'ai pas bougé de mon marché." delay={5} />
    </AbsoluteFill>
  );
};

// ============ SCENE 5: CTA finale (16-20s) ============
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 100 } });
  const ctaOpacity = interpolate(frame, [25, 38], [0, 1], { extrapolateRight: "clamp" });
  const ctaPulse = interpolate(frame % 30, [0, 15, 30], [1, 1.05, 1]);
  const tagOpacity = interpolate(frame, [38, 50], [0, 1], { extrapolateRight: "clamp" });
  const hashOpacity = interpolate(frame, [50, 62], [0, 1], { extrapolateRight: "clamp" });

  // Use happy image as blurred background
  const bgScale = interpolate(frame, [0, 120], [1.1, 1.2], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Blurred background image */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={IMAGES.aminataHappy}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${bgScale})`,
            filter: "brightness(0.25) blur(8px)",
          }}
        />
      </AbsoluteFill>

      {/* Quote from Aminata */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          padding: "0 50px",
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: 500,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            fontStyle: "italic",
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
        >
          "Maintenant je dis a toutes les mamans du marché :"
        </span>
      </div>

      {/* JIGI logo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ transform: `scale(${logoScale})`, textAlign: "center" }}>
          <span
            style={{
              fontSize: 150,
              fontWeight: 900,
              color: COLORS.cream,
              fontFamily: "Arial, sans-serif",
              letterSpacing: 10,
            }}
          >
            JIGI
          </span>
          <div style={{ marginTop: -10 }}>
            <span
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: COLORS.terracotta,
                fontFamily: "Arial, sans-serif",
                letterSpacing: 8,
              }}
            >
              HEALTH
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ opacity: tagOpacity, marginTop: 30 }}>
          <span
            style={{
              fontSize: 42,
              fontWeight: 500,
              color: COLORS.cream,
              fontFamily: "Arial, sans-serif",
            }}
          >
            La santé pour tous.
          </span>
        </div>

        {/* CTA */}
        <div style={{ opacity: ctaOpacity, transform: `scale(${ctaPulse})`, marginTop: 50 }}>
          <div
            style={{
              backgroundColor: COLORS.terracotta,
              padding: "26px 60px",
              borderRadius: 50,
              boxShadow: `0 8px 30px ${COLORS.terracotta}66`,
            }}
          >
            <span
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: "Arial, sans-serif",
              }}
            >
              3 consultations GRATUITES
            </span>
          </div>
        </div>
      </div>

      {/* Hashtags */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: hashOpacity,
        }}
      >
        <span
          style={{
            fontSize: 26,
            color: `${COLORS.cream}77`,
            fontFamily: "Arial, sans-serif",
          }}
        >
          #JIGIHealth #SantéMali #SantéPourTous
        </span>
      </div>

      {/* Terracotta bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 12,
          backgroundColor: COLORS.terracotta,
        }}
      />
    </AbsoluteFill>
  );
};

// ============ COMPOSITION PRINCIPALE ============
export const AminataTestimonial: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      {/* Voix-off ElevenLabs */}
      <Audio src="https://files.catbox.moe/3u8znz.mp3" volume={0.95} />

      {/* Musique kora en fond */}
      <Audio src="https://files.catbox.moe/0qxh0p.mp3" volume={0.15} />

      {/* Scènes calées sur la voix-off (31s total)
         Script:
         0-7s   "Chaque fois que mon fils est malade, je perds une demi-journée de vente au marché."
         7-14s  "La clinique, trois heures d'attente, quinze mille francs, et on voit même pas un vrai docteur."
         14-19s "Ma voisine m'a dit, essaie JIGI. J'ai parlé des signes de mon fils, en quinze minutes le docteur m'a répondu."
         19-24s "Je n'ai pas bougé de mon marché. Maintenant je dis à toutes les mamans."
         24-31s "JIGI. La santé pour tous."
      */}
      <Sequence from={0} durationInFrames={7 * FPS}>
        <SceneProbleme />
      </Sequence>

      <Sequence from={7 * FPS} durationInFrames={7 * FPS}>
        <SceneClinique />
      </Sequence>

      <Sequence from={14 * FPS} durationInFrames={5 * FPS}>
        <SceneDecouverte />
      </Sequence>

      <Sequence from={19 * FPS} durationInFrames={5 * FPS}>
        <SceneResultat />
      </Sequence>

      <Sequence from={24 * FPS} durationInFrames={7 * FPS}>
        <SceneCTA />
      </Sequence>

      {/* JIGI watermark */}
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 50,
          opacity: 0.35,
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            letterSpacing: 3,
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          JIGI
        </span>
      </div>
    </AbsoluteFill>
  );
};

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

const LOGO_URL = "https://files.catbox.moe/2vah2d.svg";
const STAT_SCREEN_DURATION_SEC = 7; // Durée de l'écran stat final — 2s d'animations + 5s de vue complète

const AppStoreBadge: React.FC<{ height?: number }> = ({ height = 90 }) => (
  <svg
    viewBox="0 0 260 84"
    style={{ height, width: "auto" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="260" height="84" rx="14" fill="#000" stroke="#fff" strokeWidth="1.5" />
    {/* Apple logo */}
    <path
      d="M48.3 43.1c0-7 5.7-10.4 6-10.6-3.3-4.8-8.4-5.5-10.2-5.6-4.3-.5-8.4 2.6-10.6 2.6-2.2 0-5.6-2.5-9.2-2.5-4.7.1-9.1 2.7-11.5 7-5 8.6-1.3 21.4 3.5 28.5 2.4 3.4 5.2 7.3 9 7.2 3.6-.1 5-2.3 9.4-2.3 4.4 0 5.6 2.3 9.4 2.3 3.9-.1 6.3-3.5 8.7-7 2.8-4 3.9-7.9 3.9-8.1-.1-.1-7.4-2.9-7.4-11.5zM41.5 22.1c2-2.4 3.3-5.7 2.9-9-2.8.1-6.3 1.9-8.3 4.3-1.8 2.1-3.4 5.4-3 8.7 3.2.2 6.4-1.6 8.4-4z"
      fill="#fff"
    />
    <text
      x="68"
      y="32"
      fill="#fff"
      fontFamily="Arial, sans-serif"
      fontSize="14"
    >
      Télécharger dans l&apos;
    </text>
    <text
      x="68"
      y="62"
      fill="#fff"
      fontFamily="Arial, sans-serif"
      fontSize="28"
      fontWeight="700"
    >
      App Store
    </text>
  </svg>
);

const PlayStoreBadge: React.FC<{ height?: number }> = ({ height = 90 }) => (
  <svg
    viewBox="0 0 260 84"
    style={{ height, width: "auto" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="260" height="84" rx="14" fill="#000" stroke="#fff" strokeWidth="1.5" />
    {/* Google Play triangle */}
    <defs>
      <linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#00A0FF" />
        <stop offset="1" stopColor="#00E3FF" />
      </linearGradient>
      <linearGradient id="pg2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFBD00" />
        <stop offset="1" stopColor="#FFE000" />
      </linearGradient>
      <linearGradient id="pg3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FF3A44" />
        <stop offset="1" stopColor="#C31162" />
      </linearGradient>
      <linearGradient id="pg4" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#32A071" />
        <stop offset="1" stopColor="#2DA771" />
      </linearGradient>
    </defs>
    <g transform="translate(18, 18) scale(1.3)">
      <path d="M0 0 L0 36 L20 18 Z" fill="url(#pg1)" />
      <path d="M0 0 L20 18 L26 12 L6 0 Z" fill="url(#pg2)" />
      <path d="M0 36 L20 18 L26 24 L6 36 Z" fill="url(#pg3)" />
      <path d="M20 18 L26 12 L34 18 L26 24 Z" fill="url(#pg4)" />
    </g>
    <text
      x="78"
      y="32"
      fill="#fff"
      fontFamily="Arial, sans-serif"
      fontSize="14"
    >
      DISPONIBLE SUR
    </text>
    <text
      x="78"
      y="62"
      fill="#fff"
      fontFamily="Arial, sans-serif"
      fontSize="28"
      fontWeight="700"
    >
      Google Play
    </text>
  </svg>
);

export interface DynamicPostProps {
  imageUrls: string[];
  audioUrl: string;
  backgroundMusicUrl: string;
  subtitles: string[];
  durationInSeconds: number;
  hookTitle: string;
  persona: string;
  closingStat?: string;
  closingStatSource?: string;
  closingImageUrl?: string;
}

// Crossfade transition duration (smooth continuity between images)
const CROSSFADE_FRAMES = 22; // ~0.73s at 30fps

// Ken Burns with long crossfade transition
const ImageScene: React.FC<{
  src: string;
  kenBurnsIndex: number;
  isFirst: boolean;
  isLast: boolean;
}> = ({ src, kenBurnsIndex, isFirst, isLast }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Varied Ken Burns movements based on index for visual variety
  // Index 0: zoom in center, 1: zoom out, 2: zoom in from left, 3: zoom in from right
  const kenBurnsVariant = kenBurnsIndex % 4;

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  if (kenBurnsVariant === 0) {
    scale = interpolate(frame, [0, durationInFrames], [1.0, 1.15], { extrapolateRight: "clamp" });
  } else if (kenBurnsVariant === 1) {
    scale = interpolate(frame, [0, durationInFrames], [1.15, 1.0], { extrapolateRight: "clamp" });
  } else if (kenBurnsVariant === 2) {
    scale = interpolate(frame, [0, durationInFrames], [1.08, 1.18], { extrapolateRight: "clamp" });
    translateX = interpolate(frame, [0, durationInFrames], [-20, 20], { extrapolateRight: "clamp" });
  } else {
    scale = interpolate(frame, [0, durationInFrames], [1.08, 1.18], { extrapolateRight: "clamp" });
    translateX = interpolate(frame, [0, durationInFrames], [20, -20], { extrapolateRight: "clamp" });
  }

  // Long crossfade — no fade at start for first image, no fade at end for last image
  // Use min 1 frame to avoid duplicate values in inputRange (interpolate requires strictly increasing)
  const fadeInEnd = isFirst ? 1 : CROSSFADE_FRAMES;
  const fadeOutStart = isLast ? durationInFrames - 1 : durationInFrames - CROSSFADE_FRAMES;

  const opacity = interpolate(
    frame,
    [0, fadeInEnd, fadeOutStart, durationInFrames],
    [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          filter: "brightness(0.65)",
        }}
      />
    </AbsoluteFill>
  );
};

// Subtitle overlay
const SubtitleOverlay: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const slideY = interpolate(
    spring({ frame, fps, config: { damping: 15, stiffness: 120 } }),
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
        opacity: fadeIn,
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

// Hook title overlay (first 20% of video)
const HookOverlay: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15, 60, 75], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 350,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        transform: `scale(${scale})`,
        padding: "0 50px",
        zIndex: 60,
      }}
    >
      <div
        style={{
          display: "inline-block",
          backgroundColor: `${COLORS.dark}dd`,
          padding: "24px 40px",
          borderRadius: 20,
          borderLeft: `6px solid ${COLORS.terracotta}`,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.35,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

// ============ CLOSING STAT SCREEN ============
// Écran final avec image fal.ai en fond (ou violet si pas d'image) + stat en overlay
const ClosingStatScreen: React.FC<{
  stat: string;
  source?: string;
  backgroundImageUrl?: string;
}> = ({ stat, source, backgroundImageUrl }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fond qui s'installe
  const bgOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Ken Burns on background image
  const bgScale = interpolate(frame, [0, durationInFrames], [1.0, 1.1], {
    extrapolateRight: "clamp",
  });

  // Stat text spring in
  const statScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const statOpacity = interpolate(frame, [8, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Source fade in
  const sourceOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo scale in
  const logoScale = spring({
    frame: frame - 55,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.dark,
        opacity: bgOpacity,
        zIndex: 200,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        overflow: "hidden",
      }}
    >
      {/* Background image (if available) */}
      {backgroundImageUrl && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={backgroundImageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${bgScale})`,
              filter: "brightness(0.62) saturate(1.05)",
            }}
          />
          {/* Warm cinematic overlay — dark top, terracotta glow bottom */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, rgba(26,26,46,0.55) 0%, rgba(26,26,46,0.25) 45%, rgba(200,90,58,0.45) 100%)`,
            }}
          />
        </AbsoluteFill>
      )}

      {/* Decorative orb (only if no background image) */}
      {!backgroundImageUrl && (
        <div
          style={{
            position: "absolute",
            top: 200,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.terracotta}33, transparent)`,
          }}
        />
      )}

      {/* Main stat */}
      <div
        style={{
          transform: `scale(${statScale})`,
          opacity: statOpacity,
          textAlign: "center",
          maxWidth: 900,
          marginBottom: 40,
        }}
      >
        <span
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.3,
            textShadow: "0 6px 24px rgba(0,0,0,0.75)",
          }}
        >
          {stat}
        </span>
        <div
          style={{
            width: 140,
            height: 5,
            backgroundColor: COLORS.terracotta,
            margin: "28px auto 0",
            borderRadius: 3,
          }}
        />
      </div>

      {/* Source */}
      {source && (
        <div
          style={{
            opacity: sourceOpacity,
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          <span
            style={{
              fontSize: 28,
              color: `${COLORS.cream}99`,
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
            }}
          >
            Source : {source}
          </span>
        </div>
      )}

      {/* JIGI logo + CTA + tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${logoScale})`,
        }}
      >
        <Img
          src={LOGO_URL}
          style={{ width: 170, height: 170, marginBottom: 10 }}
        />
        <div>
          <span
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: COLORS.cream,
              fontFamily: "Arial, sans-serif",
              letterSpacing: 8,
            }}
          >
            JIGI
          </span>
        </div>
        <div style={{ marginTop: 14 }}>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.cream,
              fontFamily: "Arial, sans-serif",
              lineHeight: 1.2,
              display: "block",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            Votre assistant médical personnel
          </span>
          <span
            style={{
              fontSize: 26,
              color: COLORS.terracotta,
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
              display: "block",
              marginTop: 2,
            }}
          >
            pour l&apos;Afrique
          </span>
        </div>
      </div>

      {/* App Store + Google Play badges (inline SVG, no external deps) */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          transform: `scale(${logoScale})`,
        }}
      >
        <AppStoreBadge height={90} />
        <PlayStoreBadge height={90} />
      </div>
    </AbsoluteFill>
  );
};

export const DynamicPost: React.FC<DynamicPostProps> = ({
  imageUrls,
  audioUrl,
  backgroundMusicUrl,
  subtitles,
  durationInSeconds,
  hookTitle,
  closingStat,
  closingStatSource,
  closingImageUrl,
}) => {
  const fps = 30;
  const narrativeFrames = Math.ceil(durationInSeconds * fps);
  const statFrames = closingStat ? STAT_SCREEN_DURATION_SEC * fps : 0;
  const totalFrames = narrativeFrames + statFrames;

  const subsCount = subtitles.length || 1;
  const framesPerSub = Math.floor(narrativeFrames / subsCount);

  const images = imageUrls.length > 0 ? imageUrls : [];
  const imgCount = images.length || 1;
  const framesPerImage = Math.floor(narrativeFrames / imgCount);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      {/* Voix-off (limité à la partie narrative) */}
      {audioUrl && (
        <Sequence from={0} durationInFrames={narrativeFrames}>
          <Audio src={audioUrl} volume={0.95} />
        </Sequence>
      )}

      {/* Musique de fond (toute la vidéo) */}
      {backgroundMusicUrl && <Audio src={backgroundMusicUrl} volume={0.15} />}

      {/* === NARRATIVE PART === */}
      {/* Images with Ken Burns + long crossfade transitions (0.73s overlap) */}
      {images.map((url, i) => {
        // Each image scene overlaps with the next by CROSSFADE_FRAMES
        // First image starts at frame 0, next ones start earlier to create overlap
        const sceneStart = i === 0 ? 0 : i * framesPerImage - CROSSFADE_FRAMES;
        const sceneDuration = framesPerImage + CROSSFADE_FRAMES;
        return (
          <Sequence
            key={`img-${i}`}
            from={sceneStart}
            durationInFrames={sceneDuration}
          >
            <ImageScene
              src={url}
              kenBurnsIndex={i}
              isFirst={i === 0}
              isLast={i === images.length - 1}
            />
          </Sequence>
        );
      })}

      {/* Hook title (first 20% of narrative) */}
      <Sequence from={0} durationInFrames={Math.floor(narrativeFrames * 0.2)}>
        <HookOverlay text={hookTitle} />
      </Sequence>

      {/* Subtitles synced to audio */}
      {subtitles.map((text, i) => (
        <Sequence
          key={`sub-${i}`}
          from={i * framesPerSub}
          durationInFrames={framesPerSub}
        >
          <SubtitleOverlay text={text} />
        </Sequence>
      ))}

      {/* Logo JIGI en haut a droite (narrative only) */}
      <Sequence from={0} durationInFrames={narrativeFrames}>
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            zIndex: 100,
            opacity: 0.85,
          }}
        >
          <Img src={LOGO_URL} style={{ width: 70, height: 70 }} />
        </div>
      </Sequence>

      {/* Barre terracotta en bas (narrative only) */}
      <Sequence from={0} durationInFrames={narrativeFrames}>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 12,
            backgroundColor: COLORS.terracotta,
            zIndex: 100,
          }}
        />
      </Sequence>

      {/* === CLOSING STAT SCREEN === */}
      {closingStat && (
        <Sequence from={narrativeFrames} durationInFrames={statFrames}>
          <ClosingStatScreen
            stat={closingStat}
            source={closingStatSource}
            backgroundImageUrl={closingImageUrl}
          />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

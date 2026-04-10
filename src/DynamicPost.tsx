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
const STAT_SCREEN_DURATION_SEC = 4; // Durée de l'écran stat final

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
}

// Ken Burns with crossfade transition
const ImageScene: React.FC<{
  src: string;
  direction: "in" | "out";
}> = ({ src, direction }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale =
    direction === "in"
      ? interpolate(frame, [0, durationInFrames], [1.0, 1.12], { extrapolateRight: "clamp" })
      : interpolate(frame, [0, durationInFrames], [1.12, 1.0], { extrapolateRight: "clamp" });

  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 8, durationInFrames],
    [0, 1, 1, 0],
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
          transform: `scale(${scale})`,
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
// Écran plein écran qui apparaît à la fin avec la stat qui frappe
const ClosingStatScreen: React.FC<{
  stat: string;
  source?: string;
}> = ({ stat, source }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fond violet qui s'installe
  const bgOpacity = interpolate(frame, [0, 10], [0, 1], {
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
        backgroundColor: COLORS.violet,
        opacity: bgOpacity,
        zIndex: 200,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {/* Decorative orb */}
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
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {stat}
        </span>
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

      {/* JIGI logo + tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${logoScale})`,
        }}
      >
        <Img
          src={LOGO_URL}
          style={{ width: 120, height: 120, marginBottom: 20 }}
        />
        <div>
          <span
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: COLORS.cream,
              fontFamily: "Arial, sans-serif",
              letterSpacing: 6,
            }}
          >
            JIGI
          </span>
        </div>
        <div style={{ marginTop: 4 }}>
          <span
            style={{
              fontSize: 32,
              color: COLORS.terracotta,
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
            }}
          >
            La santé pour tous
          </span>
        </div>
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
      {/* Images with Ken Burns + crossfade transitions */}
      {images.map((url, i) => (
        <Sequence
          key={`img-${i}`}
          from={i * framesPerImage}
          durationInFrames={framesPerImage + 8}
        >
          <ImageScene
            src={url}
            direction={i % 2 === 0 ? "in" : "out"}
          />
        </Sequence>
      ))}

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
          <ClosingStatScreen stat={closingStat} source={closingStatSource} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

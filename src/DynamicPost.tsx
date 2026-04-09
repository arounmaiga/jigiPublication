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

export interface DynamicPostProps {
  imageUrl: string;
  audioUrl: string;
  backgroundMusicUrl: string;
  subtitles: string[];
  durationInSeconds: number;
  hookTitle: string;
  persona: string;
}

const KenBurns: React.FC<{
  src: string;
  direction: "in" | "out";
  brightness?: number;
}> = ({ src, direction, brightness = 0.45 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale =
    direction === "in"
      ? interpolate(frame, [0, durationInFrames], [1.0, 1.15], { extrapolateRight: "clamp" })
      : interpolate(frame, [0, durationInFrames], [1.15, 1.0], { extrapolateRight: "clamp" });

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

const SubtitleOverlay: React.FC<{
  text: string;
  index: number;
}> = ({ text, index }) => {
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

export const DynamicPost: React.FC<DynamicPostProps> = ({
  imageUrl,
  audioUrl,
  backgroundMusicUrl,
  subtitles,
  durationInSeconds,
  hookTitle,
}) => {
  const fps = 30;
  const totalFrames = Math.ceil(durationInSeconds * fps);
  const subsCount = subtitles.length || 1;
  const framesPerSub = Math.floor(totalFrames / subsCount);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      {/* Voix-off */}
      {audioUrl && <Audio src={audioUrl} volume={0.95} />}

      {/* Musique de fond */}
      {backgroundMusicUrl && <Audio src={backgroundMusicUrl} volume={0.15} />}

      {/* Image de fond avec Ken Burns sur toute la duree */}
      {imageUrl && (
        <KenBurns src={imageUrl} direction="in" brightness={0.45} />
      )}

      {/* Hook title en haut (premiers 20% de la video) */}
      <Sequence from={0} durationInFrames={Math.floor(totalFrames * 0.25)}>
        <HookOverlay text={hookTitle} />
      </Sequence>

      {/* Sous-titres synchronises */}
      {subtitles.map((text, i) => (
        <Sequence
          key={i}
          from={i * framesPerSub}
          durationInFrames={framesPerSub}
        >
          <SubtitleOverlay text={text} index={i} />
        </Sequence>
      ))}

      {/* Logo JIGI watermark */}
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 50,
          opacity: 0.4,
          zIndex: 100,
        }}
      >
        <Img
          src="https://i.ibb.co/DHGxWzTg/jigi-logo-hd-v2.png"
          style={{ width: 80, height: 80 }}
        />
      </div>

      {/* Barre terracotta en bas */}
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
    </AbsoluteFill>
  );
};

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

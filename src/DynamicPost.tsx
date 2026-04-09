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

export interface DynamicPostProps {
  imageUrls: string[];
  audioUrl: string;
  backgroundMusicUrl: string;
  subtitles: string[];
  durationInSeconds: number;
  hookTitle: string;
  persona: string;
}

// Ken Burns with crossfade transition
const ImageScene: React.FC<{
  src: string;
  direction: "in" | "out";
}> = ({ src, direction }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const scale =
    direction === "in"
      ? interpolate(frame, [0, durationInFrames], [1.0, 1.12], { extrapolateRight: "clamp" })
      : interpolate(frame, [0, durationInFrames], [1.12, 1.0], { extrapolateRight: "clamp" });

  // Fade in at start, fade out at end
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

export const DynamicPost: React.FC<DynamicPostProps> = ({
  imageUrls,
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

  // Distribute images across subtitles (3 images for 5 subtitles)
  // Image 1: subtitles 0-1, Image 2: subtitles 2-3, Image 3: subtitle 4
  const images = imageUrls.length > 0 ? imageUrls : [];
  const imgCount = images.length || 1;

  // Calculate frames per image
  const framesPerImage = Math.floor(totalFrames / imgCount);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      {/* Voix-off */}
      {audioUrl && <Audio src={audioUrl} volume={0.95} />}

      {/* Musique de fond */}
      {backgroundMusicUrl && <Audio src={backgroundMusicUrl} volume={0.15} />}

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

      {/* Hook title (first 20% of video) */}
      <Sequence from={0} durationInFrames={Math.floor(totalFrames * 0.2)}>
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

      {/* Logo JIGI en haut a droite */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          zIndex: 100,
          opacity: 0.85,
        }}
      >
        <Img
          src={LOGO_URL}
          style={{ width: 70, height: 70 }}
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

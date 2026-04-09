import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

interface SceneTransitionProps {
  text: string;
  backgroundImageUrl?: string;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  text,
  backgroundImageUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const textScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const phoneY = interpolate(
    spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 60 } }),
    [0, 1],
    [1200, 0]
  );
  const phoneOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const bgScale = interpolate(frame, [0, 90], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.violet,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background image from Flux Pro */}
      {backgroundImageUrl && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={backgroundImageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${bgScale})`,
              filter: "brightness(0.3) blur(2px)",
            }}
          />
        </AbsoluteFill>
      )}

      <div
        style={{
          position: "absolute",
          top: 300,
          textAlign: "center",
          opacity: textOpacity,
          transform: `scale(${textScale})`,
          maxWidth: 850,
          padding: 40,
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.3,
            textShadow: backgroundImageUrl ? "0 3px 15px rgba(0,0,0,0.7)" : "none",
          }}
        >
          {text}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          transform: `translateY(${phoneY}px)`,
          opacity: phoneOpacity,
          width: 340,
          height: 680,
          borderRadius: 40,
          border: `4px solid ${COLORS.cream}55`,
          background: `linear-gradient(180deg, ${COLORS.dark}cc, ${COLORS.violet}cc)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: COLORS.terracotta,
            fontFamily: "Arial, sans-serif",
            letterSpacing: 6,
          }}
        >
          JIGI
        </span>
        <span
          style={{
            fontSize: 22,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            marginTop: 8,
            opacity: 0.7,
          }}
        >
          Votre santé, votre choix
        </span>
      </div>
    </AbsoluteFill>
  );
};

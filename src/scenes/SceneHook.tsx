import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

interface SceneHookProps {
  greeting: string;
  question: string;
  backgroundImageUrl?: string;
}

export const SceneHook: React.FC<SceneHookProps> = ({
  greeting,
  question,
  backgroundImageUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const greetingX = interpolate(
    spring({ frame, fps, config: { damping: 12, stiffness: 100 } }),
    [0, 1],
    [-600, 0]
  );
  const greetingOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const waveRotation = interpolate(frame, [5, 10, 15, 20], [0, 20, -10, 0], {
    extrapolateRight: "clamp",
  });

  const questionOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const questionY = interpolate(frame, [25, 40], [40, 0], {
    extrapolateRight: "clamp",
  });

  // Background image zoom effect
  const bgScale = interpolate(frame, [0, 90], [1.05, 1.15], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.violet,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {/* Background image from Flux Pro (if provided) */}
      {backgroundImageUrl && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={backgroundImageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${bgScale})`,
              filter: "brightness(0.35)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Decorative circles (visible when no background image) */}
      {!backgroundImageUrl && (
        <>
          <div
            style={{
              position: "absolute",
              top: 200,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.terracotta}33, transparent)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 300,
              left: -150,
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.teal}22, transparent)`,
            }}
          />
        </>
      )}

      {/* Greeting */}
      <div
        style={{
          transform: `translateX(${greetingX}px)`,
          opacity: greetingOpacity,
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 80,
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: 110,
            fontWeight: 800,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            textShadow: backgroundImageUrl ? "0 4px 20px rgba(0,0,0,0.6)" : "none",
          }}
        >
          {greeting}
        </span>
        <span
          style={{
            fontSize: 90,
            display: "inline-block",
            transform: `rotate(${waveRotation}deg)`,
          }}
        >
          👋
        </span>
      </div>

      {/* Question */}
      <div
        style={{
          opacity: questionOpacity,
          transform: `translateY(${questionY}px)`,
          textAlign: "center",
          maxWidth: 900,
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: backgroundImageUrl ? COLORS.cream : COLORS.terracotta,
            lineHeight: 1.3,
            fontFamily: "Arial, sans-serif",
            textShadow: backgroundImageUrl ? "0 3px 15px rgba(0,0,0,0.7)" : "none",
          }}
        >
          {question}
        </span>
      </div>
    </AbsoluteFill>
  );
};

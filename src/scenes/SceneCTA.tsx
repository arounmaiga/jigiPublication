import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

interface SceneCTAProps {
  ctaText: string;
  tagline: string;
  hashtags: string;
}

export const SceneCTA: React.FC<SceneCTAProps> = ({
  ctaText,
  tagline,
  hashtags,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  const taglineOpacity = interpolate(frame, [15, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ctaPulse = interpolate(frame % 30, [0, 15, 30], [1, 1.05, 1]);
  const ctaOpacity = interpolate(frame, [20, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const hashOpacity = interpolate(frame, [30, 40], [0, 1], {
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
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.terracotta}22, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 400,
          right: 50,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.teal}15, transparent)`,
        }}
      />

      <div
        style={{
          transform: `scale(${logoScale})`,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <span
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            letterSpacing: 12,
          }}
        >
          JIGI
        </span>
        <div style={{ marginTop: -10 }}>
          <span
            style={{
              fontSize: 36,
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

      <div
        style={{
          opacity: taglineOpacity,
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 500,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            fontStyle: "italic",
          }}
        >
          {tagline}
        </span>
      </div>

      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaPulse})`,
          marginBottom: 80,
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.terracotta,
            padding: "28px 70px",
            borderRadius: 50,
            boxShadow: `0 8px 30px ${COLORS.terracotta}66`,
          }}
        >
          <span
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {ctaText}
          </span>
        </div>
      </div>

      <div style={{ opacity: hashOpacity, textAlign: "center" }}>
        <span
          style={{
            fontSize: 28,
            color: `${COLORS.cream}88`,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {hashtags}
        </span>
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

interface ScenePrixProps {
  free: string;
  freeLabel: string;
  amount: string;
  label: string;
  comparison: string;
}

export const ScenePrix: React.FC<ScenePrixProps> = ({
  free,
  freeLabel,
  amount,
  label,
  comparison,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const freeScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const priceScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const vsOldOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.violet,
        justifyContent: "center",
        alignItems: "center",
        gap: 60,
      }}
    >
      <div style={{ transform: `scale(${freeScale})`, textAlign: "center" }}>
        <div
          style={{
            backgroundColor: COLORS.teal,
            padding: "30px 60px",
            borderRadius: 24,
            display: "inline-block",
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: COLORS.violet,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {free}
          </span>
        </div>
        <div style={{ marginTop: 20 }}>
          <span
            style={{
              fontSize: 40,
              color: COLORS.cream,
              fontFamily: "Arial, sans-serif",
              fontWeight: 500,
            }}
          >
            {freeLabel}
          </span>
        </div>
      </div>

      <div
        style={{
          width: 600,
          height: 2,
          backgroundColor: `${COLORS.cream}33`,
        }}
      />

      <div style={{ transform: `scale(${priceScale})`, textAlign: "center" }}>
        <div
          style={{
            backgroundColor: COLORS.terracotta,
            padding: "30px 50px",
            borderRadius: 24,
            display: "inline-block",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {amount}
          </span>
        </div>
        <div style={{ marginTop: 20 }}>
          <span
            style={{
              fontSize: 40,
              color: COLORS.cream,
              fontFamily: "Arial, sans-serif",
              fontWeight: 500,
            }}
          >
            {label}
          </span>
        </div>
      </div>

      <div style={{ opacity: vsOldOpacity, textAlign: "center" }}>
        <span
          style={{
            fontSize: 32,
            color: `${COLORS.cream}88`,
            fontFamily: "Arial, sans-serif",
            textDecoration: "line-through",
          }}
        >
          {comparison}
        </span>
      </div>
    </AbsoluteFill>
  );
};

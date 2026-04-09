import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

interface SceneStatProps {
  number: number;
  unit: string;
  label: string;
  sublabel: string;
}

export const SceneStat: React.FC<SceneStatProps> = ({
  number,
  unit,
  label,
  sublabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const counterValue = Math.round(
    interpolate(frame, [0, 30], [0, number], { extrapolateRight: "clamp" })
  );

  const numberScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [20, 35], [30, 0], {
    extrapolateRight: "clamp",
  });

  const pulseScale = interpolate(frame, [0, 30, 60], [0.8, 1.2, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: `4px solid ${COLORS.terracotta}44`,
          transform: `scale(${pulseScale})`,
        }}
      />

      <div style={{ transform: `scale(${numberScale})`, textAlign: "center" }}>
        <span
          style={{
            fontSize: 280,
            fontWeight: 900,
            color: COLORS.terracotta,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1,
          }}
        >
          {counterValue}{unit}
        </span>
      </div>

      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          textAlign: "center",
          maxWidth: 800,
          marginTop: 40,
        }}
      >
        <span
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: COLORS.cream,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.4,
          }}
        >
          {label}
        </span>
        <br />
        <span
          style={{
            fontSize: 38,
            fontWeight: 400,
            color: COLORS.teal,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {sublabel}
        </span>
      </div>
    </AbsoluteFill>
  );
};

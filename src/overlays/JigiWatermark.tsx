import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../constants";

export const JigiWatermark: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, 0.4], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        right: 50,
        opacity,
        zIndex: 100,
      }}
    >
      <span
        style={{
          fontSize: 38,
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
  );
};

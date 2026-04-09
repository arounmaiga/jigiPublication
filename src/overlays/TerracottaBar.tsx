import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../constants";

export const TerracottaBar: React.FC = () => {
  const frame = useCurrentFrame();

  const width = interpolate(frame, [0, 20], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 14,
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${width}%`,
          height: "100%",
          backgroundColor: COLORS.terracotta,
        }}
      />
    </div>
  );
};

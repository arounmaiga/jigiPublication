import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

interface SubtitleEntry {
  text: string;
  startFrame: number;
  endFrame: number;
}

interface SubtitleTrackProps {
  subtitles: SubtitleEntry[];
}

export const SubtitleTrack: React.FC<SubtitleTrackProps> = ({ subtitles }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find current subtitle
  const current = subtitles.find(
    (s) => frame >= s.startFrame && frame <= s.endFrame
  );

  if (!current) return null;

  const localFrame = frame - current.startFrame;

  const opacity = interpolate(
    localFrame,
    [0, 4, current.endFrame - current.startFrame - 4, current.endFrame - current.startFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const slideY = interpolate(
    spring({ frame: localFrame, fps, config: { damping: 15, stiffness: 120 } }),
    [0, 1],
    [20, 0]
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: 40,
        right: 40,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "18px 32px",
          borderRadius: 16,
          maxWidth: "90%",
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.white,
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {current.text}
        </span>
      </div>
    </div>
  );
};

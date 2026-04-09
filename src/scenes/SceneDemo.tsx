import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../constants";

interface ChatMessage {
  type: "bot" | "user";
  text: string;
  delay: number;
}

interface SceneDemoProps {
  chatMessages: ChatMessage[];
  brollVideoUrl?: string;
}

const ChatBubble: React.FC<{
  message: ChatMessage;
  frame: number;
  fps: number;
}> = ({ message, frame, fps }) => {
  const localFrame = frame - message.delay;
  if (localFrame < 0) return null;

  const slideIn = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const isBot = message.type === "bot";

  const textLength = Math.round(
    interpolate(
      localFrame,
      [0, Math.max(20, message.text.length * 0.6)],
      [0, message.text.length],
      { extrapolateRight: "clamp" }
    )
  );

  return (
    <div
      style={{
        alignSelf: isBot ? "flex-start" : "flex-end",
        transform: `translateY(${interpolate(slideIn, [0, 1], [30, 0])}px)`,
        opacity: slideIn,
        maxWidth: "85%",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderRadius: isBot ? "20px 20px 20px 4px" : "20px 20px 4px 20px",
          backgroundColor: isBot ? COLORS.cream : COLORS.terracotta,
          color: isBot ? COLORS.dark : COLORS.white,
          fontSize: 28,
          fontFamily: "Arial, sans-serif",
          fontWeight: 500,
          lineHeight: 1.4,
          whiteSpace: "pre-line",
        }}
      >
        {message.text.substring(0, textLength)}
        {textLength < message.text.length && (
          <span style={{ opacity: 0.4 }}>|</span>
        )}
      </div>
    </div>
  );
};

const MicPulse: React.FC<{ frame: number }> = ({ frame }) => {
  const showMic = frame > 50 && frame < 100;
  if (!showMic) return null;

  const pulse = interpolate(frame % 20, [0, 10, 20], [1, 1.3, 1]);
  const opacity = interpolate(frame, [50, 55, 95, 100], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        alignSelf: "center",
        opacity,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: COLORS.terracotta,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${pulse})`,
          boxShadow: `0 0 ${pulse * 20}px ${COLORS.terracotta}88`,
        }}
      >
        <span style={{ fontSize: 36 }}>🎙️</span>
      </div>
    </div>
  );
};

export const SceneDemo: React.FC<SceneDemoProps> = ({
  chatMessages,
  brollVideoUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* B-roll video from Kling 2.6 (plays behind phone, dimmed) */}
      {brollVideoUrl && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={brollVideoUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.2) blur(4px)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Phone frame */}
      <div
        style={{
          width: 420,
          height: 1500,
          borderRadius: 50,
          border: `5px solid ${COLORS.cream}33`,
          background: `linear-gradient(180deg, ${COLORS.violet}ee, ${COLORS.dark})`,
          padding: 30,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          boxShadow: brollVideoUrl ? "0 0 60px rgba(0,0,0,0.8)" : "none",
        }}
      >
        {/* Status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            padding: "10px 5px",
          }}
        >
          <span style={{ color: COLORS.cream, fontSize: 22, fontFamily: "Arial" }}>
            20:15
          </span>
          <span style={{ color: COLORS.cream, fontSize: 18, fontFamily: "Arial" }}>
            Orange ML 📶
          </span>
        </div>

        {/* App header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 30,
            padding: "14px 16px",
            borderRadius: 16,
            backgroundColor: `${COLORS.violet}cc`,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: COLORS.terracotta,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 26,
                color: COLORS.cream,
                fontWeight: 800,
                fontFamily: "Arial",
              }}
            >
              N
            </span>
          </div>
          <div>
            <div
              style={{
                color: COLORS.cream,
                fontSize: 26,
                fontWeight: 700,
                fontFamily: "Arial",
              }}
            >
              NYELE
            </div>
            <div style={{ color: COLORS.teal, fontSize: 18, fontFamily: "Arial" }}>
              Assistante santé IA
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            overflowY: "hidden",
          }}
        >
          {chatMessages.map((msg, i) => (
            <ChatBubble key={i} message={msg} frame={frame} fps={fps} />
          ))}
        </div>

        {/* Mic button */}
        <MicPulse frame={frame} />
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Audio, Sequence } from "remotion";
import { SceneHook } from "./scenes/SceneHook";
import { SceneStat } from "./scenes/SceneStat";
import { SceneTransition } from "./scenes/SceneTransition";
import { SceneDemo } from "./scenes/SceneDemo";
import { ScenePrix } from "./scenes/ScenePrix";
import { SceneCTA } from "./scenes/SceneCTA";
import { JigiWatermark } from "./overlays/JigiWatermark";
import { TerracottaBar } from "./overlays/TerracottaBar";
import { SubtitleTrack } from "./overlays/SubtitleTrack";
import { SCENES, COLORS } from "./constants";
import type { JigiPromoProps } from "./types";

export const JigiPromo: React.FC<JigiPromoProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.violet }}>
      {/* === VOICEOVER (ElevenLabs MP3, plays across all scenes) === */}
      {props.voiceoverUrl && (
        <Audio src={props.voiceoverUrl} volume={0.9} />
      )}

      {/* === SCENES === */}
      <Sequence from={SCENES.hook.start} durationInFrames={SCENES.hook.duration}>
        <SceneHook
          greeting={props.hookGreeting}
          question={props.hookQuestion}
          backgroundImageUrl={props.backgroundImageUrl}
        />
      </Sequence>

      <Sequence from={SCENES.stat.start} durationInFrames={SCENES.stat.duration}>
        <SceneStat
          number={props.statNumber}
          unit={props.statUnit}
          label={props.statLabel}
          sublabel={props.statSublabel}
        />
      </Sequence>

      <Sequence from={SCENES.transition.start} durationInFrames={SCENES.transition.duration}>
        <SceneTransition
          text={props.transitionText}
          backgroundImageUrl={props.backgroundImageUrl}
        />
      </Sequence>

      <Sequence from={SCENES.demo.start} durationInFrames={SCENES.demo.duration}>
        <SceneDemo
          chatMessages={props.chatMessages}
          brollVideoUrl={props.brollVideoUrl}
        />
      </Sequence>

      <Sequence from={SCENES.prix.start} durationInFrames={SCENES.prix.duration}>
        <ScenePrix
          free={props.prixFree}
          freeLabel={props.prixFreeLabel}
          amount={props.prixAmount}
          label={props.prixLabel}
          comparison={props.prixComparison}
        />
      </Sequence>

      <Sequence from={SCENES.cta.start} durationInFrames={SCENES.cta.duration}>
        <SceneCTA
          ctaText={props.ctaText}
          tagline={props.ctaTagline}
          hashtags={props.hashtags}
        />
      </Sequence>

      {/* === OVERLAYS (persistent across all scenes) === */}
      {props.showWatermark && <JigiWatermark />}
      {props.showTerracottaBar && <TerracottaBar />}
      {props.showSubtitles && props.subtitles && (
        <SubtitleTrack subtitles={props.subtitles} />
      )}
    </AbsoluteFill>
  );
};

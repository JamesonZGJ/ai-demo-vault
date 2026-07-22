import { Composition } from "remotion";
import { Episode001 } from "./Episode001";
import { Episode002 } from "./Episode002";
import { Episode003 } from "./Episode003";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Daily-AI-Product-001-GlassCard"
        component={Episode001}
        durationInFrames={42 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ withVoice: true, withCaptions: true }}
      />
      <Composition
        id="Daily-AI-Product-001-GlassCard-Captions"
        component={Episode001}
        durationInFrames={42 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ withVoice: false, withCaptions: true }}
      />
      <Composition
        id="Daily-AI-Product-002-MagicCard"
        component={Episode002}
        durationInFrames={42 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ withVoice: true, withCaptions: true }}
      />
      <Composition
        id="Daily-AI-Product-002-MagicCard-Captions"
        component={Episode002}
        durationInFrames={42 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ withVoice: false, withCaptions: true }}
      />
      <Composition
        id="Daily-AI-Product-003-StreamingChat"
        component={Episode003}
        durationInFrames={42 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ withVoice: true, withCaptions: true }}
      />
      <Composition
        id="Daily-AI-Product-003-StreamingChat-Captions"
        component={Episode003}
        durationInFrames={42 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ withVoice: false, withCaptions: true }}
      />
    </>
  );
};

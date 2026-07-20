import { Composition } from "remotion";
import { ProductIntro } from "./Video";
import { Episode001 } from "./Episode001";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="AI-Demo-Vault-WithVoice"
        component={ProductIntro}
        durationInFrames={45 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ withVoice: true }}
      />
      <Composition
        id="AI-Demo-Vault-Captions"
        component={ProductIntro}
        durationInFrames={45 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ withVoice: false }}
      />
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
    </>
  );
};

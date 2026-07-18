"use client";

/* eslint-disable @next/next/no-img-element -- GIF 与外部获准媒体不能都交给静态图片优化器。 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { DemoMedia } from "../../lib/demos/types";

interface ApprovedMediaProps {
  eager?: boolean;
  media: DemoMedia;
  showCaption?: boolean;
  sizes?: string;
}

interface ApprovedStillImageProps {
  alt: string;
  eager: boolean;
  elementRef: React.RefObject<HTMLImageElement | null>;
  onError: () => void;
  sizes: string;
  src: string;
}

const optimizableLocalImage = /^\/media\/.+\.(?:avif|jpe?g|png|webp)$/iu;

function ApprovedStillImage({
  alt,
  eager,
  elementRef,
  onError,
  sizes,
  src,
}: ApprovedStillImageProps) {
  if (optimizableLocalImage.test(src)) {
    return (
      <Image
        alt={alt}
        height={992}
        loading={eager ? "eager" : "lazy"}
        onError={onError}
        ref={elementRef}
        sizes={sizes}
        src={src}
        width={1586}
      />
    );
  }

  return (
    <img
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      onError={onError}
      ref={elementRef}
      src={src}
    />
  );
}

export function ApprovedMedia({
  eager = false,
  media,
  showCaption = false,
  sizes = "(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 33vw",
}: ApprovedMediaProps) {
  const [failed, setFailed] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const mediaElementRef = useRef<HTMLImageElement | HTMLVideoElement>(null);

  function retryUrl(value: string) {
    if (retryVersion === 0 || !value.startsWith("/")) return value;
    return `${value}${value.includes("?") ? "&" : "?"}retry=${retryVersion}`;
  }

  useEffect(() => {
    const element = mediaElementRef.current;
    if (
      element instanceof HTMLImageElement &&
      element.complete &&
      element.naturalWidth === 0
    ) {
      setFailed(true);
    }
  }, [media.url, retryVersion, showAnimation]);

  if (media.status !== "approved") return null;

  if (failed) {
    return (
      <figure className={`approved-media approved-media-${media.role} media-failure`}>
        <div role="status">产品画面暂时无法显示。</div>
        <button
          className="button button-small button-secondary"
          onClick={() => {
            setRetryVersion((version) => version + 1);
            setFailed(false);
          }}
          type="button"
        >
          重试
        </button>
        {showCaption && media.summary ? (
          <figcaption>{media.summary}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className={`approved-media approved-media-${media.role}`}>
      {media.kind === "video" ? (
        <video
          aria-label={media.alt}
          controls
          key={retryVersion}
          muted
          onError={() => setFailed(true)}
          playsInline
          poster={media.posterUrl ? retryUrl(media.posterUrl) : undefined}
          preload="metadata"
          ref={mediaElementRef as React.RefObject<HTMLVideoElement>}
        >
          <source src={retryUrl(media.url)} />
          {media.captionsUrl ? (
            <track default kind="captions" label="字幕" src={retryUrl(media.captionsUrl)} />
          ) : null}
          当前浏览器无法播放这个视频。
        </video>
      ) : media.kind === "gif" && media.posterUrl ? (
        <>
          {/* 默认不加载动画；显式点击代表用户主动选择播放，包括减少动态效果模式。 */}
          <img
            alt={media.alt}
            key={`${showAnimation}-${retryVersion}`}
            loading={eager ? "eager" : "lazy"}
            onError={() => setFailed(true)}
            ref={mediaElementRef as React.RefObject<HTMLImageElement>}
            src={retryUrl(showAnimation ? media.url : media.posterUrl)}
          />
          <button
            aria-pressed={showAnimation}
            className="gif-play-button"
            onClick={() => setShowAnimation((playing) => !playing)}
            type="button"
          >
            {showAnimation ? "停止动态演示" : "播放动态演示"}
          </button>
        </>
      ) : (
        <ApprovedStillImage
          alt={media.alt}
          eager={eager}
          elementRef={mediaElementRef as React.RefObject<HTMLImageElement>}
          onError={() => setFailed(true)}
          sizes={sizes}
          src={retryUrl(media.url)}
        />
      )}
      {showCaption && media.summary ? (
        <figcaption>{media.summary}</figcaption>
      ) : null}
    </figure>
  );
}

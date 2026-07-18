import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ApprovedMedia } from "@/components/media/approved-media"
import type { DemoMedia } from "@/lib/demos/types"

const gifMedia: DemoMedia = {
  alt: "AnythingLLM 产品动态演示",
  id: "anythingllm-gif",
  kind: "gif",
  posterUrl: "/media/previews/anythingllm-preview.png",
  role: "product_preview",
  status: "approved",
  url: "/media/previews/anythingllm-preview.gif",
}

afterEach(() => {
  cleanup()
})

describe("获准使用的产品媒体", () => {
  it("GIF 默认只加载静态海报，用户主动播放后才请求动画", () => {
    render(<ApprovedMedia media={gifMedia} />)

    const image = screen.getByRole("img", { name: gifMedia.alt })
    expect(image.getAttribute("src")).toBe(gifMedia.posterUrl)

    fireEvent.click(screen.getByRole("button", { name: "播放动态演示" }))
    expect(screen.getByRole("img", { name: gifMedia.alt }).getAttribute("src")).toBe(
      gifMedia.url,
    )
    const stop = screen.getByRole("button", { name: "停止动态演示" })
    expect(stop.getAttribute("aria-pressed")).toBe("true")

    fireEvent.click(stop)
    expect(screen.getByRole("img", { name: gifMedia.alt }).getAttribute("src")).toBe(
      gifMedia.posterUrl,
    )
    expect(screen.getByRole("button", { name: "播放动态演示" })).not.toBeNull()
  })

  it("本地静态图片生成响应式优化地址，移动端不下载原始封面", () => {
    render(
      <ApprovedMedia
        media={{
          alt: "RoomGPT 原创抽象封面",
          id: "roomgpt-cover",
          kind: "image",
          role: "cover",
          status: "approved",
          url: "/media/covers/roomgpt.png",
        }}
      />,
    )

    const image = screen.getByRole("img", { name: "RoomGPT 原创抽象封面" })
    expect(image.getAttribute("src")).toContain("/_next/image?url=%2Fmedia%2Fcovers%2Froomgpt.png")
    expect(image.getAttribute("srcset")).toContain("/_next/image?url=")
    expect(image.getAttribute("sizes")).toContain("100vw")
  })

  it("图片读取失败时显示明确文字，不替换成第三方素材", () => {
    render(
      <ApprovedMedia
        media={{
          alt: "读取失败的产品画面",
          id: "failed-image",
          kind: "image",
          role: "product_preview",
          status: "approved",
          url: "/media/previews/missing.png",
        }}
      />,
    )

    fireEvent.error(screen.getByRole("img", { name: "读取失败的产品画面" }))
    expect(screen.getByRole("status").textContent).toBe("产品画面暂时无法显示。")
    expect(screen.queryByRole("img", { name: "读取失败的产品画面" })).toBeNull()
    expect(screen.getByRole("button", { name: "重试" })).not.toBeNull()
  })

  it("hydration 前已经失败的图片也会转为明确失败状态", async () => {
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true)
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(0)

    render(
      <ApprovedMedia
        media={{
          alt: "过早失败的产品画面",
          id: "pre-hydration-failure",
          kind: "image",
          role: "product_preview",
          status: "approved",
          url: "/media/previews/missing-before-hydration.png",
        }}
      />,
    )

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe("产品画面暂时无法显示。")
    })
  })

  it("视频可控制、默认静音、不自动播放并提供等价摘要", () => {
    render(
      <ApprovedMedia
        media={{
          alt: "产品视频演示",
          captionsUrl: "/media/previews/product-demo.vtt",
          id: "approved-video",
          kind: "video",
          role: "product_preview",
          status: "approved",
          summary: "视频展示从输入到结果的完整操作。",
          url: "/media/previews/product-demo.mp4",
        }}
        showCaption
      />,
    )

    const video = screen.getByLabelText("产品视频演示") as HTMLVideoElement
    expect(video.controls).toBe(true)
    expect(video.muted).toBe(true)
    expect(video.autoplay).toBe(false)
    expect(video.preload).toBe("metadata")
    expect(video.querySelector('track[kind="captions"]')?.getAttribute("src")).toBe(
      "/media/previews/product-demo.vtt",
    )
    expect(screen.getByText("视频展示从输入到结果的完整操作。")).not.toBeNull()
  })
})

# Integration Guide

## 1. 读取图片

使用 `<input type="file" accept="image/*">` 或已有的 `HTMLImageElement`，将图片绘制到 Canvas。

## 2. 提取颜色

把 `ctx.getImageData(0, 0, width, height)` 传给 `extractAverageColor`。

## 3. 应用结果

返回对象包含 `hex`、`rgb` 和 `sampleCount`。可以把 `hex` 写入 CSS 变量、渐变背景或分享海报。

## 4. 已知限制

该版本使用平均色，不代表完整调色板；透明像素会被忽略；大图应先缩放到较小 Canvas 再读取。

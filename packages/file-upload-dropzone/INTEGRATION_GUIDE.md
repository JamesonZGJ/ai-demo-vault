# 智能文件上传区接入指南

## 1. 复制组件

将 `src/FileUploadDropzone.tsx` 放入 React 或 Next.js 项目。组件使用浏览器拖拽和文件输入事件，需要保留文件顶部的 `"use client"`。

## 2. 准备业务状态

```tsx
const [files, setFiles] = useState<File[]>([]);
const [state, setState] = useState<UploadState>("idle");
const [progress, setProgress] = useState(0);
```

上传区只负责选择、校验和展示状态。真正的对象存储、接口请求和进度应由业务层控制。

## 3. 接入真实上传

```tsx
<FileUploadDropzone
  accept="image/*,.pdf"
  files={files}
  maxSizeBytes={10 * 1024 * 1024}
  onFilesSelected={async (nextFiles) => {
    setFiles(nextFiles);
    setState("uploading");
    await uploadFiles(nextFiles, setProgress);
    setState("success");
  }}
  onRemove={() => {
    setFiles([]);
    setProgress(0);
    setState("idle");
  }}
  progress={progress}
  state={state}
/>
```

上传失败时，把 `state` 设为 `"error"`，并通过 `errorMessage` 传入面向用户的错误说明。

## 4. 接入检查

- 点击“选择文件”后可以用系统文件选择器完成输入。
- 只用键盘也能聚焦并触发选择按钮。
- 文件拖入时目标区域有明显反馈，离开后恢复。
- 不支持的格式、超出大小和超过数量时显示具体原因。
- 真实业务进度与 `progress` 同步，完成状态不会提前出现。
- 移除或重新选择后，旧文件状态和错误提示被清理。
- 移动端不依赖拖拽，点击选择仍然完整可用。
- 服务端仍要重复验证文件类型、大小和权限，不能只依赖前端校验。

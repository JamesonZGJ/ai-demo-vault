"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

export type UploadState = "idle" | "uploading" | "success" | "error";

export type UploadValidationError = {
  code: "file_too_large" | "invalid_type" | "too_many_files";
  fileName?: string;
  message: string;
};

export type UploadValidationResult = {
  acceptedFiles: File[];
  errors: UploadValidationError[];
};

export type FileUploadDropzoneProps = {
  accept?: string;
  acceptLabel?: string;
  disabled?: boolean;
  errorMessage?: string;
  files?: File[];
  maxFiles?: number;
  maxSizeBytes?: number;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  onRemove?: () => void;
  progress?: number;
  state?: UploadState;
};

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new Error("文件大小必须是大于或等于 0 的有限数字");
  }
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** unitIndex;
  const precision = value >= 10 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

export function fileMatchesAccept(file: File, accept: string) {
  const rules = accept
    .split(",")
    .map((rule) => rule.trim().toLocaleLowerCase())
    .filter(Boolean);
  if (rules.length === 0) return true;

  const fileName = file.name.toLocaleLowerCase();
  const fileType = file.type.toLocaleLowerCase();

  return rules.some((rule) => {
    if (rule.startsWith(".")) return fileName.endsWith(rule);
    if (rule.endsWith("/*")) {
      return fileType.startsWith(`${rule.slice(0, -1)}`);
    }
    return fileType === rule;
  });
}

export function validateUploadFiles(
  files: File[],
  {
    accept = "",
    maxFiles = 1,
    maxSizeBytes = DEFAULT_MAX_SIZE,
  }: {
    accept?: string;
    maxFiles?: number;
    maxSizeBytes?: number;
  } = {},
): UploadValidationResult {
  if (maxFiles < 1) {
    throw new Error("maxFiles 必须大于或等于 1");
  }

  const errors: UploadValidationError[] = [];
  if (files.length > maxFiles) {
    errors.push({
      code: "too_many_files",
      message: `最多选择 ${maxFiles} 个文件`,
    });
  }

  const acceptedFiles = files.slice(0, maxFiles).filter((file) => {
    if (!fileMatchesAccept(file, accept)) {
      errors.push({
        code: "invalid_type",
        fileName: file.name,
        message: `${file.name} 的格式不支持`,
      });
      return false;
    }
    if (file.size > maxSizeBytes) {
      errors.push({
        code: "file_too_large",
        fileName: file.name,
        message: `${file.name} 超过 ${formatBytes(maxSizeBytes)}`,
      });
      return false;
    }
    return true;
  });

  return { acceptedFiles, errors };
}

function containsFiles(event: DragEvent<HTMLDivElement>) {
  return Array.from(event.dataTransfer.types).includes("Files");
}

export function FileUploadDropzone({
  accept = "image/*,.pdf",
  acceptLabel = "支持图片和 PDF",
  disabled = false,
  errorMessage,
  files = [],
  maxFiles = 1,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  multiple = false,
  onFilesSelected,
  onRemove,
  progress = 0,
  state = "idle",
}: FileUploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);

  const selectFiles = (selectedFiles: File[]) => {
    const result = validateUploadFiles(selectedFiles, {
      accept,
      maxFiles: multiple ? maxFiles : 1,
      maxSizeBytes,
    });
    setValidationMessage(result.errors[0]?.message ?? null);
    if (result.acceptedFiles.length > 0) {
      onFilesSelected(result.acceptedFiles);
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const statusMessage =
    validationMessage ??
    errorMessage ??
    (state === "uploading"
      ? `正在处理，${Math.round(progress)}%`
      : state === "success"
        ? "文件处理完成"
        : "等待选择文件");

  return (
    <div className="file-upload-module">
      <div
        className={[
          "file-upload-dropzone",
          isDragActive ? "is-dragging" : "",
          state === "uploading" ? "is-uploading" : "",
          state === "success" ? "is-success" : "",
          state === "error" || validationMessage ? "is-error" : "",
          disabled ? "is-disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onDragEnter={(event) => {
          if (disabled || !containsFiles(event)) return;
          event.preventDefault();
          dragDepthRef.current += 1;
          setIsDragActive(true);
        }}
        onDragLeave={(event) => {
          if (disabled || !containsFiles(event)) return;
          event.preventDefault();
          dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
          if (dragDepthRef.current === 0) setIsDragActive(false);
        }}
        onDragOver={(event) => {
          if (disabled || !containsFiles(event)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(event) => {
          if (disabled) return;
          event.preventDefault();
          dragDepthRef.current = 0;
          setIsDragActive(false);
          selectFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <input
          accept={accept}
          className="sr-only"
          disabled={disabled}
          multiple={multiple}
          onChange={onInputChange}
          ref={inputRef}
          type="file"
        />

        <div aria-hidden="true" className="file-upload-icon">
          {state === "success" ? "✓" : isDragActive ? "↓" : "↑"}
        </div>

        <div className="file-upload-copy">
          <strong>
            {isDragActive
              ? "松开文件，开始处理"
              : state === "uploading"
                ? "正在处理文件"
                : state === "success"
                  ? "文件已经准备好"
                  : "拖入文件，或点击选择"}
          </strong>
          <span>
            {state === "uploading"
              ? `已完成 ${Math.round(progress)}%`
              : state === "success" && files[0]
                ? `${files[0].name} · ${formatBytes(files[0].size)}`
                : `${acceptLabel} · 单个不超过 ${formatBytes(maxSizeBytes)}`}
          </span>
        </div>

        {state === "uploading" ? (
          <div
            aria-label={`处理进度 ${Math.round(progress)}%`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={Math.round(progress)}
            className="file-upload-progress"
            role="progressbar"
          >
            <span style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
          </div>
        ) : null}

        {state !== "uploading" && state !== "success" ? (
          <button
            className="file-upload-button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            选择文件
          </button>
        ) : null}

        {state === "success" && onRemove ? (
          <button
            className="file-upload-remove"
            onClick={() => {
              setValidationMessage(null);
              onRemove();
            }}
            type="button"
          >
            重新选择
          </button>
        ) : null}
      </div>

      <p aria-live="polite" className="file-upload-status">
        {statusMessage}
      </p>
    </div>
  );
}

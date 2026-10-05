---
name: qwen-vl
description: "调用视觉多模态模型识别图片内容。通过 VISION_API_KEY / VISION_API_URL / VISION_MODEL 环境变量配置。适用于识图、OCR、图文理解等视觉任务。"
---

# 视觉多模态识别

## 前提

通过环境变量配置：
- `$env:VISION_API_KEY` — API Key
- `$env:VISION_API_URL` — API Endpoint
- `$env:VISION_MODEL` — 模型名称

## API 信息

- **Endpoint**: `https://api.pie-xian.com/v1/chat/completions`
- **模型**: `Codex-opus-4-6`
- **认证方式**: `Authorization: Bearer $env:VISION_API_KEY`

## 调用方式

通过 PowerShell 调用 `Invoke-RestMethod`。

### PowerShell 调用模板

```powershell
$imagePath = "图片路径"
$prompt = "你要问的问题"

# 读取图片并转 base64
$imageBytes = [System.IO.File]::ReadAllBytes($imagePath)
$base64 = [System.Convert]::ToBase64String($imageBytes)

# 判断 MIME 类型
$ext = [System.IO.Path]::GetExtension($imagePath).ToLower()
$mime = @{
    '.png' = 'image/png'
    '.jpg' = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.webp' = 'image/webp'
    '.bmp' = 'image/bmp'
    '.gif' = 'image/gif'
}[$ext]
if (-not $mime) { $mime = 'image/png' }

$body = @{
    model = $env:VISION_MODEL
    messages = @(
        @{
            role = "user"
            content = @(
                @{
                    type = "image_url"
                    image_url = @{
                        url = "data:$mime;base64,$base64"
                    }
                },
                @{
                    type = "text"
                    text = $prompt
                }
            )
        }
    )
    max_tokens = 1024
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Bearer $env:VISION_API_KEY"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $env:VISION_API_URL `
        -Method Post -Headers $headers -Body $body
    return $response.choices[0].message.content
} catch {
    throw "Vision API error: $_"
}
```

## 使用场景

- 需要识别图片/截图内容时
- OCR 文字提取
- 分析 UI 截图、图表、手写内容等
- 任何需要多模态视觉理解的场景

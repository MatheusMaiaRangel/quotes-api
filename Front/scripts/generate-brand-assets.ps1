Add-Type -AssemblyName System.Drawing

$outputPath = Join-Path $PSScriptRoot '..\assets\images\quotes-splash.png'
$bitmap = [System.Drawing.Bitmap]::new(1200, 420, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.Color]::Transparent)

$tileBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#3C6A59'))
$whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#FFFFFF'))
$accentBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#A9D6B8'))
$tile = [System.Drawing.Drawing2D.GraphicsPath]::new()
$tile.AddArc(60, 60, 140, 140, 180, 90)
$tile.AddArc(220, 60, 140, 140, 270, 90)
$tile.AddArc(220, 220, 140, 140, 0, 90)
$tile.AddArc(60, 220, 140, 140, 90, 90)
$tile.CloseFigure()
$graphics.FillPath($tileBrush, $tile)

$markFont = [System.Drawing.Font]::new('Segoe UI', 236, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$wordFont = [System.Drawing.Font]::new('Segoe UI', 171, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$format = [System.Drawing.StringFormat]::GenericTypographic
$graphics.DrawString([string][char]0x201C, $markFont, $whiteBrush, [System.Drawing.PointF]::new(155, 105), $format)
$graphics.DrawString('quotes', $wordFont, $whiteBrush, [System.Drawing.PointF]::new(414, 109), $format)
$wordWidth = $graphics.MeasureString('quotes', $wordFont, [System.Drawing.PointF]::new(414, 109), $format).Width
$graphics.DrawString('.', $wordFont, $accentBrush, [System.Drawing.PointF]::new(414 + $wordWidth, 109), $format)

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$format.Dispose()
$wordFont.Dispose()
$markFont.Dispose()
$tile.Dispose()
$accentBrush.Dispose()
$whiteBrush.Dispose()
$tileBrush.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Output $outputPath

# Servidor HTTP estatico simple para previsualizar el sitio
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$port = 8765

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Output "Servidor escuchando en http://localhost:$port/"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.AbsolutePath
    if ($path -eq "/") { $path = "/index.html" }

    $file = Join-Path $root ($path.TrimStart('/') -replace '/', '\')
    if (Test-Path $file -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ctx.Response.ContentType = $mime[$ext]
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $ctx.Response.ContentType = "text/plain; charset=utf-8"
      $b = [System.Text.Encoding]::UTF8.GetBytes("404 - No encontrado")
      $ctx.Response.OutputStream.Write($b, 0, $b.Length)
    }
    $ctx.Response.Close()
  } catch {
    Write-Output "Error: $_"
  }
}

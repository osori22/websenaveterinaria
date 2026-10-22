# Genera los recursos SVG de Huella Vital (imagenes placeholder)
$ErrorActionPreference = "Stop"

$imgDir = Join-Path (Split-Path $PSScriptRoot -Parent) "images"
if (-not (Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir | Out-Null }

# ---- paletas -------------------------------------------------------------
$pairs = @(
  @("#1e8574", "#0d3b33"),
  @("#2aa08c", "#12544a"),
  @("#f2a03d", "#d98324"),
  @("#3f7d6e", "#1c4a42"),
  @("#d97f3a", "#8c4b1c"),
  @("#4fbfa4", "#17695b")
)

# ---- motivo por categoria ------------------------------------------------
function Get-Motif([string]$cat, [int]$i) {
  switch ($cat) {
    "instalaciones" {
      @"
  <g opacity="0.16" fill="#ffffff">
    <rect x="48" y="196" width="384" height="14" rx="7"/>
    <rect x="72" y="120" width="120" height="76" rx="10"/>
    <rect x="216" y="96" width="188" height="100" rx="10"/>
    <rect x="96" y="238" width="40" height="40" rx="8"/>
    <rect x="300" y="238" width="40" height="40" rx="8"/>
  </g>
  <g transform="translate(240 84)" opacity="0.9">
    <path d="M0 26c-9 0-18 6-22 13-2 5 1 10 6 10h32c5 0 8-5 6-10-4-7-13-13-22-13z" fill="#ffffff"/>
    <ellipse cx="-24" cy="8" rx="9" ry="12" fill="#ffffff"/>
    <ellipse cx="-8" cy="-8" rx="9" ry="12" fill="#ffffff"/>
    <ellipse cx="10" cy="-8" rx="9" ry="12" fill="#ffffff"/>
    <ellipse cx="26" cy="8" rx="9" ry="12" fill="#ffffff"/>
  </g>
"@
    }
    "consultas" {
      @"
  <g opacity="0.18" fill="#ffffff">
    <rect x="70" y="210" width="340" height="16" rx="8"/>
    <rect x="150" y="120" width="180" height="90" rx="12"/>
  </g>
  <g transform="translate(240 96)">
    <rect x="-56" y="-56" width="112" height="112" rx="26" fill="#ffffff" opacity="0.92"/>
    <path d="M-13 -38h26v25h25v26h-25v25h-26v-25h-25v-26h25z" fill="#1e8574"/>
  </g>
"@
    }
    "mascotas" {
      @"
  <g opacity="0.15" fill="#ffffff">
    <circle cx="150" cy="120" r="58"/>
    <circle cx="330" cy="230" r="72"/>
    <circle cx="110" cy="250" r="38"/>
  </g>
  <g transform="translate(240 168)">
    <path d="M0 26c-13 0-27 9-33 20-3 6 1 13 9 13h48c8 0 12-7 9-13-6-11-20-20-33-20z" fill="#ffffff"/>
    <ellipse cx="-32" cy="4" rx="13" ry="17" fill="#ffffff"/>
    <ellipse cx="-11" cy="-18" rx="13" ry="17" fill="#ffffff"/>
    <ellipse cx="13" cy="-18" rx="13" ry="17" fill="#ffffff"/>
    <ellipse cx="34" cy="4" rx="13" ry="17" fill="#ffffff"/>
  </g>
"@
    }
    default {
      @"
  <g opacity="0.16" fill="#ffffff">
    <circle cx="160" cy="150" r="52"/>
    <rect x="112" y="212" width="96" height="72" rx="48"/>
    <circle cx="322" cy="150" r="52"/>
    <rect x="274" y="212" width="96" height="72" rx="48"/>
  </g>
  <g transform="translate(240 92)" opacity="0.95">
    <circle cx="0" cy="0" r="30" fill="#ffffff"/>
    <path d="M-44 96c0-24 20-42 44-42s44 18 44 42z" fill="#ffffff"/>
  </g>
"@
    }
  }
}

# ---- generador ------------------------------------------------------------
function New-Svg([string]$path, [string]$label, [string]$cat, [int]$w, [int]$h, [int]$idx) {
  $p = $pairs[$idx % $pairs.Count]
  $c1 = $p[0]; $c2 = $p[1]
  $motif = Get-Motif $cat $idx
  $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 $w $h" width="$w" height="$h" role="img" aria-label="$label">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="$c1"/>
      <stop offset="100%" stop-color="$c2"/>
    </linearGradient>
  </defs>
  <rect width="$w" height="$h" fill="url(#bg)"/>
  <circle cx="$([int]($w * 0.82))" cy="$([int]($h * 0.16))" r="$([int]($h * 0.32))" fill="#ffffff" opacity="0.07"/>
  <circle cx="$([int]($w * 0.12))" cy="$([int]($h * 0.9))" r="$([int]($h * 0.26))" fill="#ffffff" opacity="0.06"/>
$motif
  <text x="24" y="$($h - 26)" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="700" fill="#ffffff" opacity="0.92">$label</text>
</svg>
"@
  [System.IO.File]::WriteAllText($path, $svg, (New-Object System.Text.UTF8Encoding($false)))
}

# ---- favicon --------------------------------------------------------------
$favicon = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Huella Vital">
  <rect width="64" height="64" rx="16" fill="#17695b"/>
  <g transform="translate(32 34)" fill="#ffffff">
    <path d="M0 10c-9 0-18 6-22 13-2 5 1 10 6 10h32c5 0 8-5 6-10-4-7-13-13-22-13z"/>
    <ellipse cx="-19" cy="-4" rx="7" ry="9"/>
    <ellipse cx="-7" cy="-16" rx="7" ry="9"/>
    <ellipse cx="8" cy="-16" rx="7" ry="9"/>
    <ellipse cx="20" cy="-4" rx="7" ry="9"/>
  </g>
</svg>
"@
[System.IO.File]::WriteAllText((Join-Path $imgDir "favicon.svg"), $favicon, (New-Object System.Text.UTF8Encoding($false)))

# ---- hero / equipo --------------------------------------------------------
New-Svg (Join-Path $imgDir "hero.svg") "Consulta veterinaria Huella Vital" "consultas" 640 540 0
New-Svg (Join-Path $imgDir "equipo.svg") "Equipo medico" "equipo" 600 450 3

# ---- galeria --------------------------------------------------------------
$galeria = @(
  @("Recepcion y sala de espera", "instalaciones"),
  @("Consultorio con mesa de examen", "consultas"),
  @("Diagnostico por imagen", "consultas"),
  @("Laboratorio clinico", "instalaciones"),
  @("Bruno en consulta", "mascotas"),
  @("Luli descansando", "mascotas"),
  @("Quirofano", "instalaciones"),
  @("Hospitalizacion", "instalaciones"),
  @("Nuestro equipo", "equipo"),
  @("Dra. Mariana Lopez", "equipo"),
  @("Primer dia en casa", "mascotas"),
  @("Dia de peluqueria", "mascotas")
)

for ($i = 0; $i -lt $galeria.Count; $i++) {
  $name = "galeria-{0:d2}.svg" -f ($i + 1)
  New-Svg (Join-Path $imgDir $name) $galeria[$i][0] $galeria[$i][1] 480 360 $i
}

Write-Output "Generados $((Get-ChildItem $imgDir -Filter *.svg).Count) archivos en images/"

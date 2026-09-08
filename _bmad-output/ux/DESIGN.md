---
title: FotoBook — Design System
status: draft
created: 2026-09-07
updated: 2026-09-07
---

# FotoBook — DESIGN.md

## Brand & Style

**Nome:** FotoBook
**Tagline:** "Suas fotos, sua história"
**Personalidade:** Simples, acolhedora, pessoal, confiável
**Tom visual:** Limpo, moderno, minimalista — as fotos são a estrela

> FotoBook é um espaço pessoal e acolhedor. O design deve ser invisível — nunca competir com as fotos. Interface neutra, tipografia clara, pouca decoração.

---

## Colors

### Primary Palette

```yaml
colors:
  primary:
    50: "#eff6ff"    # Blue 50 - Backgrounds suaves
    100: "#dbeafe"   # Blue 100 - Hover states
    200: "#bfdbfe"   # Blue 200 - Borders
    300: "#93c5fd"   # Blue 300 - Disabled
    400: "#60a5fa"   # Blue 400 - Links
    500: "#3b82f6"   # Blue 500 - Botões primários
    600: "#2563eb"   # Blue 600 - Botão hover ★
    700: "#1d4ed8"   # Blue 700 - Botão active
    800: "#1e40af"   # Blue 800 - Texto em fundo azul
    900: "#1e3a8a"   # Blue 900 - Títulos em fundo azul
```

### Semantic Colors

```yaml
colors:
  success:
    50: "#f0fdf4"
    500: "#22c55e"
    600: "#16a34a"   # Upload sucesso ✓
    700: "#15803d"

  error:
    50: "#fef2f2"
    500: "#ef4444"
    600: "#dc2626"   # Upload erro ✗
    700: "#b91c1c"

  warning:
    50: "#fffbeb"
    500: "#f59e0b"
    600: "#d97706"   # Atenção

  neutral:
    50: "#fafafa"   # Background da página ★
    100: "#f5f5f5"  # Background de cards
    200: "#e5e7eb"  # Bordas ★
    300: "#d1d5db"  # Bordas hover
    400: "#9ca3af"  # Texto muted
    500: "#737373"  # Texto secundário ★
    600: "#525252"  # Texto corpo
    700: "#404040"  # Texto primário
    800: "#262626"  # Títulos ★
    900: "#171717"  # Texto máximo
```

---

## Typography

```yaml
typography:
  font_family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  
  heading_1:
    size: "2.25rem"    # 36px
    weight: 700
    line_height: 1.2
    color: "{neutral.800}"
  
  heading_2:
    size: "1.875rem"   # 30px
    weight: 700
    line_height: 1.3
    color: "{neutral.800}"
  
  heading_3:
    size: "1.5rem"     # 24px
    weight: 600
    line_height: 1.4
    color: "{neutral.800}"
  
  body:
    size: "1rem"       # 16px
    weight: 400
    line_height: 1.6
    color: "{neutral.600}"
  
  small:
    size: "0.875rem"   # 14px
    weight: 400
    line_height: 1.5
    color: "{neutral.500}"
```

---

## Layout & Spacing

```yaml
layout:
  max_width: "1280px"   # Container máximo
  padding: "1rem"       # Padding mobile
  padding_md: "1.5rem"  # Padding tablet
  padding_lg: "2rem"    # Padding desktop
  
  grid:
    columns_mobile: 2
    columns_tablet: 3
    columns_desktop: 4
    gap: "0.75rem"      # 12px
  
  border_radius:
    sm: "0.5rem"        # 8px - Inputs, cards pequenos
    md: "0.75rem"       # 12px - Cards, botões ★
    lg: "1rem"          # 16px - Modais, dropzone ★
    xl: "1.5rem"        # 24px - Hero sections
    full: "9999px"      # Tags, pills

spacing:
  xs: "0.25rem"   # 4px
  sm: "0.5rem"    # 8px
  md: "1rem"      # 16px ★
  lg: "1.5rem"    # 24px
  xl: "2rem"      # 32px
  2xl: "3rem"     # 48px
```

---

## Elevation & Depth

```yaml
elevation:
  shadow_sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  shadow_md: "0 4px 6px -1px rgb(0 0 0 / 0.1)"    # Cards ★
  shadow_lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)"   # Modais
  shadow_xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)"   # Lightbox
```

---

## Components

### Button Primary
```yaml
button_primary:
  background: "{primary.600}"
  color: white
  padding: "0.75rem 1.5rem"
  border_radius: "{border_radius.md}"
  font_weight: 600
  hover:
    background: "{primary.700}"
    transform: "translateY(-1px)"
  active:
    transform: "translateY(0)"
  disabled:
    background: "{neutral.300}"
    cursor: not-allowed
```

### Card
```yaml
card:
  background: white
  border: "1px solid {neutral.200}"
  border_radius: "{border_radius.md}"
  shadow: "{shadow_md}"
  padding: "{spacing.md}"
  hover:
    border_color: "{primary.300}"
    shadow: "{shadow_lg}"
```

### Input
```yaml
input:
  background: white
  border: "1px solid {neutral.200}"
  border_radius: "{border_radius.sm}"
  padding: "0.5rem 0.75rem"
  font_size: "0.875rem"
  focus:
    border_color: "{primary.500}"
    ring: "2px solid {primary.200}"
```

### Tag
```yaml
tag:
  background: "{neutral.100}"
  color: "{neutral.700}"
  padding: "0.25rem 0.75rem"
  border_radius: "{border_radius.full}"
  font_size: "0.75rem"
  font_weight: 500
  active:
    background: "{primary.600}"
    color: white
```

### Photo Card
```yaml
photo_card:
  aspect_ratio: "1/1"
  border_radius: "{border_radius.md}"
  overflow: hidden
  shadow: "{shadow_sm}"
  hover:
    shadow: "{shadow_lg}"
    transform: "scale(1.02)"
  transition: "all 0.3s ease"
```

---

## Do's and Don'ts

### Do ✓
- Usar cores neutras como fundo para destacar fotos
- Manter tipografia limpa e legível
- Usar espaçamento generoso entre elementos
- Fornecer feedback visual em todas as ações
- Manter consistência nos border-radius
- Usar animações sutis (200-300ms)

### Don't ✗
- Usar cores vibrantes que competem com as fotos
- Sobrecarregar a interface com decoração
- Usar fontes decorativas ou complexas
- Criar muitos níveis de profundidade
- Usar animações longas ou distrativas
- Ignorar estados de loading e erro

---

*Design System v1.0*
*FotoBook — BMAD Method*

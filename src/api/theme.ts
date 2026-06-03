/**
 * Theme tokens a consumer can override. Each maps to a `--inkp-*` CSS variable
 * scoped to the editor instance. `dark` overrides apply when dark mode is active.
 */
export interface ThemeColors {
  app?: string
  surface?: string
  sidebar?: string
  muted?: string
  hover?: string
  active?: string
  input?: string
  line?: string
  lineSubtle?: string
  ink?: string
  subtle?: string
  faint?: string
  strong?: string
  accent?: string
  accentHover?: string
  onAccent?: string
  primary?: string
  onPrimary?: string
  header?: string
  headerFg?: string
  link?: string
  danger?: string
}

export interface ThemeFont {
  sans?: string
  mono?: string
  baseSize?: string
}

export interface ThemeTokens {
  colors?: ThemeColors
  dark?: ThemeColors
  font?: ThemeFont
}

/** Map a theme color key → its `--inkp-*` variable name. */
const COLOR_VARS: Record<keyof ThemeColors, string> = {
  app: '--inkp-bg',
  surface: '--inkp-bg-surface',
  sidebar: '--inkp-bg-sidebar',
  muted: '--inkp-bg-muted',
  hover: '--inkp-bg-hover',
  active: '--inkp-bg-active',
  input: '--inkp-bg-input',
  line: '--inkp-border',
  lineSubtle: '--inkp-border-subtle',
  ink: '--inkp-text',
  subtle: '--inkp-text-secondary',
  faint: '--inkp-text-muted',
  strong: '--inkp-text-strong',
  accent: '--inkp-accent',
  accentHover: '--inkp-accent-hover',
  onAccent: '--inkp-on-accent',
  primary: '--inkp-btn-primary-bg',
  onPrimary: '--inkp-btn-primary-text',
  header: '--inkp-header-bg',
  headerFg: '--inkp-header-fg',
  link: '--inkp-link',
  danger: '--inkp-status-danger',
}

function colorsToDecls(colors: ThemeColors): string {
  return (Object.keys(colors) as (keyof ThemeColors)[])
    .filter((k) => colors[k] != null)
    .map((k) => `${COLOR_VARS[k]}:${colors[k]};`)
    .join('')
}

function fontToDecls(font: ThemeFont): string {
  const parts: string[] = []
  if (font.sans) parts.push(`--inkp-font-sans:${font.sans};`)
  if (font.mono) parts.push(`--inkp-font-mono:${font.mono};`)
  return parts.join('')
}

/**
 * Build a scoped <style> body applying a theme to one instance (by class).
 * Returns '' when there is nothing to override.
 */
export function themeToCss(scopeClass: string, theme?: ThemeTokens): string {
  if (!theme) return ''
  const base = [
    theme.colors ? colorsToDecls(theme.colors) : '',
    theme.font ? fontToDecls(theme.font) : '',
    theme.font?.baseSize ? `font-size:${theme.font.baseSize};` : '',
  ].join('')

  let css = ''
  if (base) css += `.${scopeClass}{${base}}`
  if (theme.dark) {
    const darkDecls = colorsToDecls(theme.dark)
    if (darkDecls) css += `.${scopeClass}.dark{${darkDecls}}`
  }
  return css
}

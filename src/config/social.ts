/**
 * Predefined social networks. Icons come from the Simple Icons CDN (white glyph
 * shown on the brand-colored chip). Each social item may override `icon` with a
 * custom image URL, and use the network key `custom` for anything else.
 */
export interface SocialNetwork {
  key: string
  label: string
  color: string
  /** White-glyph icon URL (rendered on the brand-colored chip). */
  image: string
}

function glyph(slug: string): string {
  return `https://cdn.simpleicons.org/${slug}/white`
}

export const SOCIAL_NETWORKS: SocialNetwork[] = [
  { key: 'facebook', label: 'Facebook', color: '#1877F2', image: glyph('facebook') },
  { key: 'twitter', label: 'X (Twitter)', color: '#000000', image: glyph('x') },
  { key: 'instagram', label: 'Instagram', color: '#E4405F', image: glyph('instagram') },
  { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', image: glyph('linkedin') },
  { key: 'youtube', label: 'YouTube', color: '#FF0000', image: glyph('youtube') },
  { key: 'reddit', label: 'Reddit', color: '#FF4500', image: glyph('reddit') },
  { key: 'github', label: 'GitHub', color: '#181717', image: glyph('github') },
  { key: 'tiktok', label: 'TikTok', color: '#000000', image: glyph('tiktok') },
  { key: 'pinterest', label: 'Pinterest', color: '#BD081C', image: glyph('pinterest') },
  { key: 'whatsapp', label: 'WhatsApp', color: '#25D366', image: glyph('whatsapp') },
  { key: 'telegram', label: 'Telegram', color: '#26A5E4', image: glyph('telegram') },
]

export const SOCIAL_MAP: Record<string, SocialNetwork> = Object.fromEntries(
  SOCIAL_NETWORKS.map((n) => [n.key, n]),
)

/** Resolve display data for a social item (custom icon overrides the network). */
export function resolveSocial(item: { network: string; icon?: string }) {
  const net = SOCIAL_MAP[item.network]
  const custom = !!item.icon
  return {
    label: net?.label ?? item.network,
    color: custom ? 'transparent' : (net?.color ?? '#1f2937'),
    image: item.icon || net?.image || '',
    isCustom: custom,
  }
}

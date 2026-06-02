import type {
  BgImage,
  Body,
  BorderValue,
  BoxValue,
  Column,
  Row,
} from '@/types/schema'
import { DEFAULT_FONT } from '@/config/fonts'
import { uid } from '@/utils/id'

/* Value primitive factories ----------------------------------------- */

export function box(
  top = 0,
  right = top,
  bottom = top,
  left = right,
): BoxValue {
  return { top, right, bottom, left }
}

export function noBorder(): BorderValue {
  return { width: 0, style: 'solid', color: '#000000' }
}

export function noBgImage(): BgImage {
  return { url: '', repeat: 'no-repeat', size: 'cover', position: 'center center' }
}

/* Structure factories ------------------------------------------------ */

export function createColumn(): Column {
  return {
    id: uid('col'),
    contents: [],
    values: {
      backgroundColor: 'transparent',
      padding: box(0),
      border: noBorder(),
      borderRadius: 0,
      verticalAlign: 'top',
    },
  }
}

export function createRow(cells: number[] = [12]): Row {
  return {
    id: uid('row'),
    cells,
    columns: cells.map(() => createColumn()),
    values: {
      backgroundColor: 'transparent',
      columnsBackground: 'transparent',
      backgroundImage: noBgImage(),
      fullWidth: false,
      padding: box(0),
      border: noBorder(),
      borderRadius: 0,
      verticalAlign: 'top',
      hideOn: { desktop: false, mobile: false },
      stackOnMobile: true,
    },
  }
}

export function createBody(): Body {
  return {
    id: uid('body'),
    values: {
      contentWidth: 600,
      backgroundColor: '#f4f4f5',
      contentBackground: '#ffffff',
      backgroundImage: noBgImage(),
      fontFamily: DEFAULT_FONT,
      textColor: '#1f2937',
      linkColor: '#2563eb',
      preheaderText: '',
      direction: 'ltr',
      language: 'en',
      padding: box(0),
    },
    rows: [],
  }
}

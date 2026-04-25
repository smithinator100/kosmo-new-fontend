/**
 * Centralised Lucide icon registry. Call `refreshIcons()` whenever new
 * `[data-lucide]` placeholders appear in the DOM.
 */

import {
  createIcons,
  ChevronRight,
  ClipboardPaste,
  Copy,
  CornerDownLeft,
  FileText,
  LayoutGrid,
  LoaderCircle,
  Paintbrush,
  Palette,
  Search,
  Settings2,
  Shapes,
  Skull,
  Sparkles,
  Type,
  Wand2,
  Wrench,
  X,
} from 'lucide';

export const ICONS = {
  ChevronRight,
  ClipboardPaste,
  Copy,
  CornerDownLeft,
  FileText,
  LayoutGrid,
  LoaderCircle,
  Paintbrush,
  Palette,
  Search,
  Settings2,
  Shapes,
  Skull,
  Sparkles,
  Type,
  Wand2,
  Wrench,
  X,
};

export function refreshIcons(): void {
  createIcons({ icons: ICONS, attrs: { 'stroke-width': 1.5 } });
}

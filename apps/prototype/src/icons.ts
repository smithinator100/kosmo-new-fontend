/**
 * Centralised Lucide icon registry. Call `refreshIcons()` whenever new
 * `[data-lucide]` placeholders appear in the DOM.
 */

import {
  createIcons,
  ChevronLeft,
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
  Star,
  Trash2,
  Type,
  Wand2,
  Wrench,
  X,
} from 'lucide';

export const ICONS = {
  ChevronLeft,
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
  Star,
  Trash2,
  Type,
  Wand2,
  Wrench,
  X,
};

export function refreshIcons(): void {
  createIcons({ icons: ICONS, attrs: { 'stroke-width': 1.5 } });
}

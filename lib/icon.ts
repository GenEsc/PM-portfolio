import type { ComponentType, SVGProps } from "react";

/**
 * Shared icon component type. Both `lucide-react` icons and the local brand
 * SVGs in `components/icons/brand.tsx` satisfy this, so data files can type an
 * `icon` field uniformly without depending on a specific icon library.
 */
export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

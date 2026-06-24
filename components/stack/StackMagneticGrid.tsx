import StackCategory from "@/components/stack/StackCategory";
import { STACK } from "@/lib/data/stack";

/**
 * Desktop tech stack: the three categories as magnetic grids. Responsive via the
 * `.stack-grid` rules in globals.css — 3-up (≥1024px) → 2+1 with the last group
 * centred (768–1023px) → hidden below 768px (the mobile sphere shows instead).
 */
export default function StackMagneticGrid() {
  return (
    <div className="stack-grid hidden md:grid">
      {STACK.map((group) => (
        <StackCategory key={group.title} title={group.title} items={group.items} />
      ))}
    </div>
  );
}

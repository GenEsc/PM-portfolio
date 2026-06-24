import MagnetCell from "@/components/stack/MagnetCell";
import type { Tech } from "@/lib/data/stack";

/**
 * One stack category: a centred title above a 2-column grid of magnetic cells.
 * Icons are laid out in rows of two so an odd last item ends up centred (not
 * left-aligned). See change-tech-stack-interactive.md.
 */
export default function StackCategory({
  title,
  items,
}: {
  title: string;
  items: Tech[];
}) {
  const rows: Tech[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="font-mono text-sm font-medium uppercase tracking-wider text-content-muted">
        {title}
      </h3>
      <div className="flex flex-col items-center gap-3">
        {rows.map((row) => (
          <div key={row[0].name} className="flex justify-center gap-3">
            {row.map((tech) => (
              <MagnetCell key={tech.name} icon={tech.icon} name={tech.name} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

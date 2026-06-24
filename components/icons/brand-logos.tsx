"use client";

/**
 * Tech brand logos (developer-icons), re-exported as client references.
 *
 * developer-icons components are plain functions with no "use client" directive.
 * The Stack section (a Server Component) passes the chosen logo to client cells
 * (e.g. `MagnetCell`) as a prop, and RSC cannot serialise a bare function across
 * the server→client boundary. Re-exporting them from this "use client" module
 * turns each into a client reference, which serialises fine. Aliased away from the
 * bare brand names (e.g. `React`) so they don't shadow React itself.
 *
 * Logos keep their official brand colours (MIT terms) — see change-animated-icons.md.
 */
export {
  React as ReactLogo,
  Angular as AngularLogo,
  TypeScript as TypeScriptLogo,
  HTML5 as Html5Logo,
  CSS3 as Css3Logo,
  Java as JavaLogo,
  Spring as SpringLogo,
  PostgreSQL as PostgresLogo,
  MongoDB as MongoLogo,
  AWS as AwsLogo,
  Azure as AzureLogo,
  Docker as DockerLogo,
  Git as GitLogo,
} from "developer-icons";

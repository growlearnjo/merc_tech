// Stop: si cambió el código y las pruebas fallan, Claude no puede darse por terminado.
// Exit 2 = Claude sigue trabajando; lo que se escribe en stderr es el motivo que ve.
const { spawnSync } = require("child_process");
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  const e = JSON.parse(raw || "{}");

  // Si ya lo mandamos de vuelta una vez, lo dejamos parar: así no entra en bucle.
  if (e.stop_hook_active) process.exit(0);

  // ¿Cambió algo fuera de docs/? Si no, no hay código nuevo que probar.
  const cwd = process.env.CLAUDE_PROJECT_DIR || e.cwd;
  const cambios = spawnSync("git", ["status", "--porcelain", "--", ".", ":(exclude)docs"], { cwd, encoding: "utf8" });
  if (!String(cambios.stdout || "").trim()) process.exit(0);

  const r = spawnSync("npm", ["test"], { cwd, encoding: "utf8", shell: true });
  if (r.status !== 0) {
    const salida = ((r.stdout || "") + (r.stderr || "")).split("\n").slice(-25).join("\n");
    process.stderr.write(
      "Las pruebas fallan (npm test). No des la tarea por terminada: corrige el código o explica por qué falla.\n" + salida
    );
    process.exit(2);
  }
  process.exit(0);
});

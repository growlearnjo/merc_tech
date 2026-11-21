// PreToolUse: bloquea lo que una regla de permisos no alcanza a ver.
// Lee el evento por stdin. Exit 2 = bloquear; lo que se escribe en stderr es el motivo que ve Claude.
// Vigila las dos consolas de Claude Code: Bash (macOS, Linux, Git Bash) y PowerShell (Windows).
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let e;
  try {
    e = JSON.parse(raw || "{}");
  } catch {
    // Un evento que no se entiende se bloquea: un hook roto no debe abrir la puerta.
    process.stderr.write("Bloqueado por el hook del proyecto: no pude leer el evento.");
    process.exit(2);
  }
  const tool = e.tool_name;
  const input = e.tool_input || {};

  // 1. Comandos destructivos, aunque vengan en medio de otro comando, en Bash o en PowerShell.
  if (tool === "Bash" || tool === "PowerShell") {
    const cmd = String(input.command || "");
    const reglas = [
      [/git\s+reset\s+--hard/, "git reset --hard borra cambios sin commitear"],
      [/git\s+(checkout\s+(\S+\s+)?--\s|restore\s+(?![^\n;&|]*--staged))/, "git checkout -- y git restore descartan cambios sin commitear"],
      [/git\s+push\b[^\n;&|]*(--force|\s-f\b|\s\+\S)/, "git push --force (o con +rama) reescribe la historia del remoto"],
      [/git\s+clean\s+-[a-zA-Z]*f/, "git clean -f borra archivos que git no sigue"],
      // rm -rf, rm -r -f, rm --recursive --force; Remove-Item -Recurse (y sus alias); rd /s y del /s.
      [/(?<!git\s+)\b(rm|rmdir|rd|del|erase|ri|Remove-Item)\b(?=[^\n;&|]*\s(-[dfiIrRv]*[rR][dfiIrRv]*\b|--recursive\b|-[Rr]ec[a-z]*\b|\/[sS]\b))/, "borrar una carpeta entera con todo su contenido no tiene papelera"],
    ];
    for (const [patron, motivo] of reglas) {
      if (patron.test(cmd)) {
        process.stderr.write(
          "Bloqueado por el hook del proyecto: " + motivo +
          ". Si de verdad hace falta, lo corre la persona en su terminal."
        );
        process.exit(2);
      }
    }
  }

  // 2. El tech-lead no lee docs/: ahí están el inventario y la lista del autor.
  if (e.agent_type === "tech-lead" && ["Read", "Grep", "Glob"].includes(tool)) {
    const rutas = [input.file_path, input.path, input.pattern, input.glob].filter(Boolean).map(String);
    if (rutas.some((r) => /(^|[\\/])docs([\\/]|$)/.test(r))) {
      process.stderr.write("Bloqueado por el hook del proyecto: el tech-lead no lee docs/.");
      process.exit(2);
    }
  }

  process.exit(0);
});

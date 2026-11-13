"""
tokens.py — cuánto consumió cada conversación de Claude Code.

PARA QUÉ SIRVE
--------------
Con un plan de suscripción, el comando de costo de Claude Code informa el
PORCENTAJE semanal del plan, no el gasto de una conversación. Y una tarea
entera suele mover ese porcentaje menos de un punto, así que no sirve para
medir nada.

Pero los tokens sí están guardados. Claude Code escribe cada conversación en
tu disco, y cada respuesta trae su contador. Este script los suma.

Resultado: una fila por conversación, con los tokens de entrada, los de caché
(escritos y leídos), los de salida, la duración y el equivalente en dólares a
las tarifas públicas del modelo. Y debajo, el desglose por bloques.

CÓMO SE USA
-----------
Desde la raíz de tu proyecto, con la carpeta de tu sesión:

    python doc_sesions/sesion2/tokens.py

Y si quieres apuntar a otra carpeta de proyecto:

    python doc_sesions/sesion2/tokens.py "C:\\ruta\\a\\otro\\proyecto"

QUÉ ES UN BLOQUE
----------------
Un chat casi nunca tiene un solo trabajo dentro. Le pides una cosa, después
otra, después le preguntas algo. La fila de la conversación suma las tres, así
que no te dice lo que costó cada una.

Un bloque es cada cosa que pediste: tu mensaje y todas las respuestas que
vinieron después, hasta tu mensaje siguiente. Eso es lo que costó esa tarea.

Al final el script muestra los bloques de la conversación más reciente, que
suele ser la que acabas de terminar. Para ver los de otra:

    python doc_sesions/sesion2/tokens.py --bloques b498fb0d
    python doc_sesions/sesion2/tokens.py --bloques todas

PARA LA TAREA PATRÓN
--------------------
El dato que va a la tabla de MEDICIONES es el del bloque de tu enunciado, no
el de la conversación entera. Y lo más simple es que no haya que elegir: si el
chat de la tarea patrón lleva solo la tarea, su único bloque ya es el dato.

QUÉ SIGNIFICA CADA COLUMNA
--------------------------
entrada     Tokens nuevos que el modelo leyó por primera vez. Se pagan completos.
caché esc   Tokens guardados en caché para reusarlos. Cuestan ~1,25x la entrada.
caché lec   Tokens servidos desde la caché. Cuestan una fracción (1/20 en Opus).
salida      Tokens que el modelo escribió. Son los más caros.
duración    Reloj de pared entre el primer y el último mensaje.
~USD        Equivalente a tarifas públicas. Con un plan NO se te cobra esto:
            es el valor de lo que consumiste, útil para comparar entre tareas.

LA COLUMNA QUE MÁS ENSEÑA es "caché lec". Si es mucho mayor que "entrada", la
caché está trabajando y te está ahorrando la mayor parte del gasto. Si es cero
en conversaciones largas, algo la está invalidando.

OJO
---
Las tarifas de abajo son públicas y CAMBIAN. Están anotadas con su fecha de
consulta. Si el número importa, verifícalas antes de citarlas.
"""

import datetime
import glob
import json
import os
import sys

try:  # para que los acentos no rompan la consola de Windows
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

# Tarifas por millón de tokens, consultadas el 2026-11-09.
# Si trabajas con otro modelo, cámbialas acá.
TARIFAS = {
    "claude-opus-5-5": {"in": 4.0, "cache_write": 5.0, "cache_read": 0.20, "out": 20.0},
    "claude-sonnet-5-5": {"in": 2.0, "cache_write": 2.5, "cache_read": 0.10, "out": 10.0},
    "claude-haiku-5-5": {"in": 0.10, "cache_write": 0.125, "cache_read": 0.01, "out": 0.50},
}
POR_DEFECTO = TARIFAS["claude-opus-5-5"]

# Claude Code guarda, con el mismo formato que tus mensajes, avisos que tú no
# escribiste: el archivo que abriste en el editor, recordatorios del sistema,
# la salida de un comando con barra. Esos no abren un bloque nuevo.
ENVOLTURAS = (
    "<ide_",
    "<system-reminder",
    "<local-command",
    "<command-name",
    "<command-message",
    "<command-args",
    "<user-prompt-submit-hook",
    "<session-start-hook",
    "<post-tool-use-hook",
)


def carpeta_de_proyecto(ruta):
    """Claude Code guarda las conversaciones en ~/.claude/projects/<ruta-con-guiones>."""
    base = os.path.join(os.path.expanduser("~"), ".claude", "projects")
    clave = ruta.replace(":", "-").replace("\\", "-").replace("/", "-").replace("_", "-")
    if clave and clave[0].isalpha():
        clave = clave[0].lower() + clave[1:]
    exacta = os.path.join(base, clave)
    if os.path.isdir(exacta):
        return exacta
    # Plan B: buscar una carpeta que termine con el nombre del proyecto.
    hoja = os.path.basename(ruta.rstrip("\\/")).replace("_", "-").lower()
    for c in sorted(glob.glob(os.path.join(base, "*"))):
        if os.path.isdir(c) and os.path.basename(c).lower().endswith(hoja):
            return c
    return None


def texto_tuyo(o):
    """Lo que escribiste en esa línea, o None si no la escribiste tú."""
    if o.get("type") != "user" or o.get("isMeta"):
        return None
    contenido = (o.get("message") or {}).get("content")
    if isinstance(contenido, str):
        trozos = [contenido]
    elif isinstance(contenido, list):
        trozos = [
            x.get("text", "")
            for x in contenido
            if isinstance(x, dict) and x.get("type") == "text"
        ]
    else:
        return None
    for t in trozos:
        s = t.strip()
        if s and not s.startswith(ENVOLTURAS):
            return s
    return None


def resumen_prompt(texto, ancho=66):
    """La primera parte de tu mensaje, para reconocer el bloque de un vistazo."""
    s = texto
    if s.startswith("<pasted_content"):
        corte = s.find(">")
        if corte != -1:
            s = s[corte + 1:]
    s = " ".join(s.split())
    return s if len(s) <= ancho else s[:ancho - 1] + "…"


def cero():
    return {"in": 0, "cw": 0, "cr": 0, "out": 0}


CAMPOS = (
    ("in", "input_tokens"),
    ("cw", "cache_creation_input_tokens"),
    ("cr", "cache_read_input_tokens"),
    ("out", "output_tokens"),
)


def leer(archivo):
    """Devuelve el total de la conversación y la lista de sus bloques."""
    tot, turnos, modelos, marcas = cero(), 0, set(), []
    bloques, actual = [], None
    # Claude Code parte una misma respuesta en varias líneas (una por bloque de
    # texto o por herramienta) y todas repiten el mismo "usage". Se cuenta cada
    # respuesta una sola vez, por su message.id; si no, el gasto sale ~2x.
    vistos = set()
    with open(archivo, encoding="utf-8", errors="replace") as f:
        for linea in f:
            try:
                o = json.loads(linea)
            except ValueError:
                continue

            mio = texto_tuyo(o)
            if mio is not None:
                actual = {
                    "n": len(bloques) + 1,
                    "prompt": mio,
                    "hora": (o.get("timestamp") or "")[11:16],
                    "tot": cero(),
                    "turnos": 0,
                    "modelos": set(),
                    # La duración del bloque va de tu mensaje a la última
                    # respuesta, no hasta tu mensaje siguiente: lo que tardaste
                    # en leer no es tiempo de trabajo del agente.
                    "marcas": [o["timestamp"]] if o.get("timestamp") else [],
                }
                bloques.append(actual)

            msg = o.get("message") or {}
            uso = msg.get("usage")
            mid = msg.get("id")
            if isinstance(uso, dict) and mid in vistos:
                uso = None
            if isinstance(uso, dict):
                if mid:
                    vistos.add(mid)
                turnos += 1
                for clave, campo in CAMPOS:
                    tot[clave] += uso.get(campo) or 0
                if msg.get("model"):
                    modelos.add(msg["model"])
                if actual:
                    actual["turnos"] += 1
                    for clave, campo in CAMPOS:
                        actual["tot"][clave] += uso.get(campo) or 0
                    if msg.get("model"):
                        actual["modelos"].add(msg["model"])
                    if o.get("timestamp"):
                        actual["marcas"].append(o["timestamp"])

            if o.get("timestamp"):
                marcas.append(o["timestamp"])

    return tot, turnos, modelos, marcas, bloques


def minutos(marcas):
    if not marcas:
        return ""
    try:
        a = datetime.datetime.fromisoformat(min(marcas).replace("Z", "+00:00"))
        b = datetime.datetime.fromisoformat(max(marcas).replace("Z", "+00:00"))
    except ValueError:
        return ""
    m = round((b - a).total_seconds() / 60)
    return "menos de 1 min" if m == 0 else "%d min" % m


def dolares(tot, modelos):
    t = POR_DEFECTO
    for m in modelos:
        if m in TARIFAS:
            t = TARIFAS[m]
            break
    return (
        tot["in"] * t["in"]
        + tot["cw"] * t["cache_write"]
        + tot["cr"] * t["cache_read"]
        + tot["out"] * t["out"]
    ) / 1_000_000


def imprimir_bloques(nombre, bloques, invocacion):
    print("\nDesglose de la conversación %s: un bloque por cada cosa que pediste." % nombre)
    if not bloques:
        print("  No encontré mensajes tuyos en esta conversación.")
        return
    for b in bloques:
        t = b["tot"]
        print('\n  Bloque %d — %s — "%s"' % (b["n"], b["hora"], resumen_prompt(b["prompt"])))
        print(
            "     turnos %d · entrada %s · caché esc %s · caché lec %s · salida %s · %s · US$ %.2f"
            % (
                b["turnos"],
                "{:,}".format(t["in"]),
                "{:,}".format(t["cw"]),
                "{:,}".format(t["cr"]),
                "{:,}".format(t["out"]),
                minutos(b["marcas"]) or "sin dato",
                dolares(t, b["modelos"]),
            )
        )
    print("\n  Los bloques suman el total de la fila de arriba.")
    print("  A la tabla de MEDICIONES va el bloque de tu enunciado, no la conversación entera.")
    print("  Desglose de otra conversación: %s --bloques <conversación>" % invocacion)
    print("  Desglose de todas:             %s --bloques todas" % invocacion)


def main():
    args = sys.argv[1:]
    pedido = None
    if "--bloques" in args:
        i = args.index("--bloques")
        args.pop(i)
        if i < len(args) and not args[i].startswith("-"):
            pedido = args.pop(i)
        else:
            pedido = "todas"
    ruta = args[0] if args else os.getcwd()
    try:
        invocacion = "python " + os.path.relpath(
            os.path.abspath(__file__), os.getcwd()
        ).replace("\\", "/")
    except ValueError:
        invocacion = "python tokens.py"

    carpeta = carpeta_de_proyecto(os.path.abspath(ruta))
    if not carpeta:
        print("No encontré las conversaciones de este proyecto.")
        print("Mira qué carpetas hay en: %s"
              % os.path.join(os.path.expanduser("~"), ".claude", "projects"))
        return 1

    print("Proyecto: %s" % ruta)
    print("Conversaciones en: %s\n" % carpeta)

    filas, total, total_usd, total_turnos = [], cero(), 0.0, 0
    todos_modelos = set()
    for archivo in sorted(glob.glob(os.path.join(carpeta, "*.jsonl")), key=os.path.getmtime):
        tot, turnos, modelos, marcas, bloques = leer(archivo)
        if turnos == 0:
            continue
        usd = dolares(tot, modelos)
        filas.append((os.path.basename(archivo)[:8], turnos, tot, minutos(marcas), usd, bloques))
        for k in total:
            total[k] += tot[k]
        total_usd += usd
        total_turnos += turnos
        todos_modelos |= modelos

    if not filas:
        print("La carpeta existe pero no tiene conversaciones con contadores todavía.")
        return 1

    cab = "%-12s%7s%10s%12s%12s%10s%16s%9s" % (
        "conversación", "turnos", "entrada", "caché esc", "caché lec", "salida",
        "duración", "~USD")
    print(cab)
    print("-" * len(cab))
    for nombre, turnos, tot, dur, usd, _ in filas:
        print("%-12s%7d%10s%12s%12s%10s%16s%9.2f" % (
            nombre, turnos, "{:,}".format(tot["in"]), "{:,}".format(tot["cw"]),
            "{:,}".format(tot["cr"]), "{:,}".format(tot["out"]), dur, usd))
    print("-" * len(cab))
    print("%-12s%7d%10s%12s%12s%10s%16s%9.2f" % (
        "TOTAL", total_turnos, "{:,}".format(total["in"]), "{:,}".format(total["cw"]),
        "{:,}".format(total["cr"]), "{:,}".format(total["out"]), "", total_usd))

    if total["in"] + total["cw"] > 0 and total["cr"] > 0:
        t = POR_DEFECTO
        for m in todos_modelos:
            if m in TARIFAS:
                t = TARIFAS[m]
                break
        sin_cache = total["cr"] * t["in"] / 1_000_000
        con_cache = total["cr"] * t["cache_read"] / 1_000_000
        print("\nLo que hizo la caché: esos %s tokens leídos costaron US$ %.2f." % (
            "{:,}".format(total["cr"]), con_cache))
        print("Sin caché, como entrada nueva, habrían costado US$ %.2f." % sin_cache)

    # El desglose por bloques. Sin pedir nada, la conversación más reciente.
    if pedido == "todas":
        elegidas = filas
    elif pedido:
        elegidas = [f for f in filas if f[0].startswith(pedido[:8])]
        if not elegidas:
            print("\nNo encontré la conversación %s. Usa un nombre de la tabla." % pedido)
    else:
        elegidas = filas[-1:]
    for nombre, _, _, _, _, bloques in elegidas:
        imprimir_bloques(nombre, bloques, invocacion)

    print("\nModelos: %s" % (", ".join(sorted(todos_modelos)) or "sin dato"))
    print("Tarifas públicas consultadas el 2026-11-09; verifícalas si el número importa.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

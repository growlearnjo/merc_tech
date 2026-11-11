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
las tarifas públicas del modelo.

CÓMO SE USA
-----------
Desde la raíz de tu proyecto:

    python doc_sesions/sesion1/tokens.py

Y si querés apuntar a otra carpeta de proyecto:

    python doc_sesions/sesion1/tokens.py "C:\\ruta\\a\\otro\\proyecto"

QUÉ SIGNIFICA CADA COLUMNA
--------------------------
entrada     Tokens nuevos que el modelo leyó por primera vez. Se pagan completos.
caché esc   Tokens guardados en caché para reusarlos. Cuestan ~1,25x la entrada.
caché lec   Tokens servidos desde la caché. Cuestan una fracción (1/20 en Opus).
salida      Tokens que el modelo escribió. Son los más caros.
duración    Reloj de pared entre el primer y el último mensaje de la conversación.
~USD        Equivalente a tarifas públicas. Con un plan NO se te cobra esto:
            es el valor de lo que consumiste, útil para comparar entre tareas.

LA COLUMNA QUE MÁS ENSEÑA es "caché lec". Si es mucho mayor que "entrada", la
caché está trabajando y te está ahorrando la mayor parte del gasto. Si es cero
en conversaciones largas, algo la está invalidando.

OJO
---
Las tarifas de abajo son públicas y CAMBIAN. Están anotadas con su fecha de
consulta. Si el número importa, verificalas antes de citarlas.
"""

import datetime
import glob
import json
import os
import sys

# Tarifas por millón de tokens, consultadas el 2026-11-09.
# Si trabajás con otro modelo, cambialas acá.
TARIFAS = {
    "claude-opus-5-5": {"in": 4.0, "cache_write": 5.0, "cache_read": 0.20, "out": 20.0},
    "claude-sonnet-5-5": {"in": 2.0, "cache_write": 2.5, "cache_read": 0.10, "out": 10.0},
    "claude-haiku-5-5": {"in": 0.10, "cache_write": 0.125, "cache_read": 0.01, "out": 0.50},
}
POR_DEFECTO = TARIFAS["claude-opus-5-5"]


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


def leer(archivo):
    tot = {"in": 0, "cw": 0, "cr": 0, "out": 0}
    turnos, modelos, marcas = 0, set(), []
    with open(archivo, encoding="utf-8", errors="replace") as f:
        for linea in f:
            try:
                o = json.loads(linea)
            except ValueError:
                continue
            msg = o.get("message") or {}
            uso = msg.get("usage")
            if isinstance(uso, dict):
                turnos += 1
                tot["in"] += uso.get("input_tokens") or 0
                tot["cw"] += uso.get("cache_creation_input_tokens") or 0
                tot["cr"] += uso.get("cache_read_input_tokens") or 0
                tot["out"] += uso.get("output_tokens") or 0
                if msg.get("model"):
                    modelos.add(msg["model"])
            if o.get("timestamp"):
                marcas.append(o["timestamp"])
    return tot, turnos, modelos, marcas


def minutos(marcas):
    if not marcas:
        return ""
    try:
        a = datetime.datetime.fromisoformat(min(marcas).replace("Z", "+00:00"))
        b = datetime.datetime.fromisoformat(max(marcas).replace("Z", "+00:00"))
        return "%d min" % round((b - a).total_seconds() / 60)
    except ValueError:
        return ""


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


def main():
    ruta = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    carpeta = carpeta_de_proyecto(os.path.abspath(ruta))
    if not carpeta:
        print("No encontré las conversaciones de este proyecto.")
        print("Mirá qué carpetas hay en: %s" % os.path.join(os.path.expanduser("~"), ".claude", "projects"))
        return 1

    print("Proyecto: %s" % ruta)
    print("Conversaciones en: %s\n" % carpeta)

    filas, total, total_usd, total_turnos = [], {"in": 0, "cw": 0, "cr": 0, "out": 0}, 0.0, 0
    todos_modelos = set()
    for archivo in sorted(glob.glob(os.path.join(carpeta, "*.jsonl")), key=os.path.getmtime):
        tot, turnos, modelos, marcas = leer(archivo)
        if turnos == 0:
            continue
        usd = dolares(tot, modelos)
        filas.append((os.path.basename(archivo)[:8], turnos, tot, minutos(marcas), usd))
        for k in total:
            total[k] += tot[k]
        total_usd += usd
        total_turnos += turnos
        todos_modelos |= modelos

    if not filas:
        print("La carpeta existe pero no tiene conversaciones con contadores todavía.")
        return 1

    cab = "%-12s%7s%10s%12s%12s%10s%10s%9s" % (
        "conversación", "turnos", "entrada", "caché esc", "caché lec", "salida", "duración", "~USD")
    print(cab)
    print("-" * len(cab))
    for nombre, turnos, tot, dur, usd in filas:
        print("%-12s%7d%10s%12s%12s%10s%10s%9.2f" % (
            nombre, turnos, "{:,}".format(tot["in"]), "{:,}".format(tot["cw"]),
            "{:,}".format(tot["cr"]), "{:,}".format(tot["out"]), dur, usd))
    print("-" * len(cab))
    print("%-12s%7d%10s%12s%12s%10s%10s%9.2f" % (
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

    print("\nModelos: %s" % (", ".join(sorted(todos_modelos)) or "sin dato"))
    print("Tarifas públicas consultadas el 2026-11-09; verificalas si el número importa.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

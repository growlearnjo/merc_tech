# Placeholders del material

Todo dato que cambia de un alumno a otro se escribe como **marcador**, nunca
con el valor de quien redactó el documento.

Esta es la lección más cara de la Ed. 4: sus prompts llevaban el hash del
commit del autor, su usuario de GitHub y las versiones exactas de sus
herramientas, con la instrucción de **no recortar el contexto**. Para cualquier
otra persona, cada uno de esos datos era falso, y el agente se pasaba el turno
persiguiendo un estado que no existía.

> **Regla:** esta tabla es la única fuente de marcadores. Una spec que invente
> un marcador nuevo está mal: o usa uno de estos, o se agrega aquí primero.

---

## Los seis marcadores

| Marcador | Qué es | Cómo lo obtiene el alumno |
|---|---|---|
| `<TU_USUARIO>` | Su usuario de GitHub | Está en la esquina de github.com, o `gh api user -q .login` |
| `<TU_REPO>` | El repositorio del curso, normalmente `<TU_USUARIO>/mercadotech-lite` | Lo crea en la sesión 1; `git remote -v` lo confirma |
| `<COMMIT_ANTERIOR>` | El commit con el que cerró la sesión previa | `git log --oneline -1` al empezar la sesión |
| `<RUTA_PROYECTO>` | La carpeta donde vive su app | `pwd` |
| `<URL_PR>` | El pull request con el que trabaja la sesión | Lo imprime `gh pr create`, o la URL del navegador |
| `<COSTO_REFERENCIA>` | El costo que el docente midió para esa tarea | Sale de `BITACORA_PRODUCCION.md`; el alumno compara el suyo contra él |

---

## Versiones: mínimos, no exactos

Las herramientas se escriben como **mínimo** y con el comando que lo comprueba.
Un número exacto caduca entre dos ediciones y deja al alumno sin saber si su
versión sirve.

| Herramienta | Se escribe | No se escribe |
|---|---|---|
| Node | "Node 20 o superior (`node --version`)" | "Node 24" |
| npm | "el npm que trae tu Node (`npm --version`)" | "npm 11.6.2" |
| Claude Code | "Claude Code instalado y autenticado (`claude --version`)" | una versión concreta |
| Git | "Git instalado (`git --version`)" | una versión concreta |

Excepción, y solo una: **el pin de npm del CI**. Si el workflow fija una
versión de npm, tiene que ser la que generó el *lockfile del alumno*, no la del
docente — y si el alumno regenera el lockfile, cambia en los dos sitios a la
vez (`package.json` y el workflow). La spec que lo pida lo dice con esas
palabras.

---

## Lo que nunca va en un documento del curso

* El valor de una clave, un token o una contraseña. Ni de ejemplo.
* Un hash de commit de otra persona.
* Un usuario, una organización o una URL de producción ajenos.
* Una cifra de ahorro o de mejora que nadie midió ("hasta un 40 %").
* Un número de versión exacto donde basta un mínimo.

## Cómo se comprueba

El gate se corre **solo sobre el material de alumno**, y eso es deliberado:

```bash
MAT="curso-ed5/Ed5_sesion*.md curso-ed5/PROMPTS_sesion*.md curso-ed5/ENCARGO_LITE.md curso-ed5/TAREA_PATRON.md"

grep -rnEi "growlearnjo|\.vercel\.app|hf_[A-Za-z0-9]|sb_secret|eyJ" $MAT
grep -rnE "\b[0-9a-f]{7,40}\b" $MAT | grep -E "[0-9]"
```

Las dos líneas deben devolver vacío. Si aparece algo, o es un marcador que
falta o es un dato que no debería estar escrito.

### Por qué el gate NO cubre todo `curso-ed5/`

Porque este archivo, `CONVENCIONES.md` y las dos plantillas **tienen que
nombrar los contraejemplos** para explicar la regla: el usuario del autor, los
hashes de la Ed. 4, el propio comando de grep. Si el gate los marcara,
devolvería seis líneas de falsos positivos cada vez.

Es la misma lección que el `CLAUDE.md` del ejemplar aprendió con sus greps de
arquitectura: la versión sin ancla marcaba los *comentarios* que explican por
qué un archivo NO importa algo. **Un gate con falsos positivos deja de
leerse** — y un gate que nadie lee no protege nada.

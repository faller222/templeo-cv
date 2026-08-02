# TempleoCV — Producto (Módulo 1 de Templeo)

## Contexto

Templeo es un sistema multi-módulo. **TempleoCV** es el Módulo 1: gestión y generación de CVs con IA. Debe poder vivir **standalone** (ads + economía de tokens) y más adelante alimentar al resto de Templeo.

Usuarios que entren al generador gratuito pueden migrar a otras funcionalidades de Templeo después.

## Diferencia clave: Maestro vs CV

| Concepto | Rol |
|----------|-----|
| **Master Profile** | Verdad del usuario: toda experiencia, educación, skills, etc. Máxima transparencia con la IA. |
| **CV Instance** | Proyección/adaptación para un puesto o template concreto. Puede omitir u ordenar distinto. |

La IA puede usar el master para orientar instancias aunque el CV final no incluya todo.

## Features V1

- Editor + preview en vivo
- Múltiples templates (one-pager y extendidos); contador de usages a futuro
- Asistencias IA: resumen, bullets, ATS, translate, **generate-cv** desde master + hint libre
- Clonar CV (misma base, otro puesto)
- Export PDF (texto seleccionable)
- Auth Google + LinkedIn OIDC
- Créditos IA (stub de farmeo ads)
- API: exportar **perfil** (no “el CV”); listar y POST de instancias CV

## Features V2 / fuera de este corte

- Importador / diseñador de templates de terceros (marketplace, monedas)
- Import LinkedIn file completo
- Apply a Job Posting → dispara CV específico (otro módulo Templeo)
- AdSense Active View en producción

## Naming

Producto standalone: **TempleoCV**.

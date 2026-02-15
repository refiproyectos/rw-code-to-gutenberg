# RW Code to Gutenberg (Single Section)

## Objetivo
Convertir una sección concreta (HTML/CSS/JS + captura) en **1 plugin WordPress** que registre **1 bloque Gutenberg** en la categoría **Refineria**.

## Alcance (fase actual)
- 1 plugin = 1 bloque (1 sección).
- El bloque debe ser usable en producción, mantenible y escalable.
- Más adelante se ampliará a múltiples bloques por plugin.

## Entrada esperada
El solicitante debe aportar:
- Código generado por Google Stitch (HTML, CSS y JS de la sección).
- Nombre de la web.
- Nombre de la sección.
- Captura de referencia visual.

## Salida obligatoria
Entregar un plugin instalable que incluya:
- Registro del bloque en Gutenberg.
- Bloque visible dentro de la categoría `Refineria`.
- Ajustes de la sección y ajustes por elemento interno.
- Soporte i18n/multilenguaje con archivos de idioma mantenidos.
- ZIP instalable + carpeta fuente.

## Convenciones de naming
- Nombre visible del bloque: `RW nombredelaweb sección`.
- Namespace del bloque: `refineria`.
- Slug técnico del bloque: `refineria/rw-{web}-{seccion}`.
  - Normalizar a minúsculas.
  - Sustituir espacios por guiones.
  - Evitar caracteres especiales.

## Stack técnico por defecto
- `block.json` como fuente de verdad del bloque.
- `@wordpress/scripts` para build.
- Editor en React/JSX.
- Bloque `static` por defecto (usar dinámico solo cuando se solicite explícitamente).

## Requisitos funcionales del bloque
### 1) Registro y descubribilidad
- Registrar el bloque correctamente con APIs oficiales de WordPress.
- Asegurar que aparece en la categoría `Refineria`.

### 2) Ajustes de sección (mínimo)
- Fondo (imagen/color/overlay cuando aplique).
- Espaciados principales.
- Ancho/alineación.
- Clases extra y anchor soportadas por Gutenberg.

### 3) Ajustes por elemento interno (mínimo)
Aplicar paneles de control específicos, como mínimo, para:
- Título.
- Subtítulo.
- Texto descriptivo.
- Botón primario.
- Botón secundario.
- Medios relevantes (imagen de fondo o principal).

Cada elemento debe permitir editar contenido y opciones de estilo que no rompan la estructura base.

### 4) Integración frontend/editor
- Mantener paridad visual razonable entre editor y frontend.
- Separar estilos de editor y frontend cuando corresponda.
- Cargar JS frontend solo si el bloque lo necesita.

## Internacionalización (obligatorio)
### Idiomas por defecto
- Español
- Catalán
- Inglés

### Política i18n
- Todo string visible debe ser traducible.
- Definir y usar un único `textdomain` del plugin.
- Mantener siempre actualizados los archivos de idioma con cada cambio de textos.

### Archivos mínimos de idiomas
En `languages/` mantener:
- Archivo plantilla `.pot`.
- Traducciones para español (`es_ES`).
- Traducciones para catalán (`ca`).
- Traducciones para inglés (`en_US`).

Se espera mantener pares de archivos de traducción compilados cuando aplique (`.po/.mo`) y regenerar la plantilla cuando cambien cadenas.

## Estructura recomendada del plugin

```text
rw-{web}-{seccion}/
  rw-{web}-{seccion}.php
  block.json
  package.json
  src/
    index.js
    edit.js
    save.js
    style.scss
    editor.scss
  build/
  languages/
    {textdomain}.pot
    {textdomain}-es_ES.po
    {textdomain}-es_ES.mo
    {textdomain}-ca.po
    {textdomain}-ca.mo
    {textdomain}-en_US.po
    {textdomain}-en_US.mo
  README.md
```

Nota: `build/` se genera en compilación y debe estar presente en la entrega instalable.

## Flujo estándar de trabajo
1. Recibir input (código Stitch + sección + captura).
2. Definir slug técnico y nombre visible según convención RW.
3. Crear estructura del plugin.
4. Implementar bloque y controles:
   - Ajustes de sección.
   - Ajustes por elemento.
5. Implementar estilos editor/frontend.
6. Integrar i18n en todos los textos.
7. Generar/actualizar idiomas (`.pot`, `es_ES`, `ca`, `en_US`).
8. Build del bloque.
9. Validar en WordPress (editor + frontend).
10. Entregar carpeta + ZIP.

## Criterios de aceptación
El trabajo se considera completo solo si:
- Existe 1 plugin instalable con 1 bloque funcional.
- El bloque aparece bajo categoría `Refineria`.
- El nombre visible sigue el formato `RW nombredelaweb sección`.
- Hay ajustes de sección y de elementos internos.
- Todos los textos del bloque son traducibles.
- Los archivos de idioma requeridos existen y están al día.
- El bloque se renderiza correctamente en editor y frontend.

## No objetivos (fase actual)
- No generar múltiples bloques por plugin.
- No diseñar librería completa de bloques todavía.
- No introducir lógica dinámica PHP salvo petición explícita.

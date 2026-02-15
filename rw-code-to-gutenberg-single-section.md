# RW Code to Gutenberg (Single Section)

## 1) Propósito del sistema
Convertir **una sección concreta** de código frontend (habitualmente una página completa generada por Google Stitch) en **un plugin WordPress instalable** que registre **un único bloque Gutenberg** en la categoría `Refineria`.

El objetivo no es generar prototipos, sino bloques usables en producción con:
- Controles suficientes para edición real.
- Paridad visual razonable editor/frontend.
- Soporte multilenguaje mantenido.
- Estructura mantenible y versionada.

---

## 2) Alcance actual (vigente)
- 1 plugin = 1 bloque = 1 sección.
- El input puede venir como **HTML de página completa**; hay que **identificar y extraer** la sección pedida.
- Entrega en local + versionado en GitHub.
- Idiomas base obligatorios: `es_ES`, `ca`, `en_US`.

Fuera de alcance por ahora:
- Múltiples bloques por plugin.
- Lógica dinámica PHP (salvo solicitud explícita).
- Librería completa de bloques en un único plugin.

---

## 3) Convenciones de naming
### 3.1 Nombre visible
Formato obligatorio:
- `RW nombredelaweb sección`

Ejemplo real:
- `RW Palma Beauty Palma Home Hero`

### 3.2 Slug técnico
Formato obligatorio:
- `refineria/rw-{web}-{seccion}`

Reglas:
- minúsculas
- espacios -> guiones
- sin caracteres especiales

Ejemplo real:
- `refineria/rw-palma-beauty-palma-home-hero`

### 3.3 Textdomain
Debe coincidir con el slug de plugin:
- `rw-{web}-{seccion}`

Ejemplo real:
- `rw-palma-beauty-palma-home-hero`

---

## 4) Entrada esperada
El usuario puede pasar:
1. Nombre de la web.
2. Nombre de la sección.
3. Código Stitch (a veces documento HTML completo).
4. Captura de la sección objetivo.

### 4.1 Regla de extracción cuando viene página completa
Si Stitch entrega una página completa:
1. Detectar el comentario o bloque semántico de sección (ej.: `<!-- Hero Section -->`).
2. Extraer únicamente el fragmento relevante.
3. Ignorar cabecera global, footer y secciones no solicitadas.
4. Mantener contenido textual y estructura visual de la sección target.

---

## 5) Salida obligatoria
Generar plugin instalable en `wp-content/plugins/` con:
- Registro correcto del bloque.
- Categoría `Refineria` visible en inserter.
- Controles de sección y de elementos.
- i18n completo (POT/PO/MO + JSON para JS si aplica).
- ZIP instalable (si se solicita entrega directa).

---

## 6) Stack y estrategia técnica
### 6.1 Estrategia actual validada
Para la fase de iteración rápida del bloque real:
- `block.json` + `block.js` (sin pipeline de build obligatorio)
- `style.css` + `editor.css`
- archivo principal PHP del plugin
- `block.asset.php` manual

### 6.2 Estrategia recomendada de plantilla
Para repositorio base reusable:
- `@wordpress/scripts` con `src/` y `build/`
- misma semántica de controles

Ambas son válidas; la prioridad en pruebas con cliente es velocidad de iteración y estabilidad en WordPress local.

---

## 7) Estructura de plugin (single section)
```text
rw-{web}-{seccion}/
  rw-{web}-{seccion}.php
  block.json
  block.js
  block.asset.php
  style.css
  editor.css
  languages/
    {textdomain}.pot
    {textdomain}-es_ES.po
    {textdomain}-es_ES.mo
    {textdomain}-ca.po
    {textdomain}-ca.mo
    {textdomain}-en_US.po
    {textdomain}-en_US.mo
    {textdomain}-<locale>-<hash>.json   (si hay cadenas JS mapeadas)
```

---

## 8) Requisitos funcionales mínimos del bloque
## 8.1 Bloque y categoría
- Registrar bloque con `register_block_type`.
- Si no existe `refineria`, crear categoría vía filtro `block_categories_all`.

## 8.2 Controles de contenido
Como mínimo:
- eyebrow/subtítulo
- título
- descripción
- botón primario (texto + URL)
- botón secundario (texto + URL)
- imagen de fondo

## 8.3 Controles de estilo por sección/elemento
Como mínimo:
- tamaño de texto donde aplique
- colores de texto/fondo/borde donde aplique
- fuente donde aplique
- margen y padding

## 8.4 Enlaces internos/externos
Para cada botón:
- URL editable
- toggle `Abrir en nueva pestaña`
- si activo: `target="_blank"` + `rel="noopener noreferrer"`

---

## 9) Estado real implementado (baseline actual)
Este baseline ya está probado en el bloque `Palma Home Hero`:

### 9.1 Sección
- `min-height`
- opacidad overlay
- imagen de fondo
- ancho máximo de contenido
- alineación de texto
- fuente de sección
- border radius
- spacing avanzado de sección

### 9.2 Elementos
- Eyebrow: texto, color texto/fondo, tamaño, spacing avanzado.
- Título: texto, tamaño, ancho máximo, color, fuente, spacing avanzado.
- Descripción: texto, tamaño, color, fuente, spacing avanzado.
- Botón primario: texto, URL, `_blank`, colores, tamaño, fuente, spacing avanzado.
- Botón secundario: texto, URL, `_blank`, colores, tamaño, fuente, spacing avanzado.
- Wrapper de botones: margen superior.

### 9.3 Spacing avanzado (mejora aplicada)
Para cada bloque de spacing se usa:
- 4 campos: `Top`, `Right`, `Bottom`, `Left`
- selector de unidad: `px | rem | em | % | vw | vh`
- composición final en shorthand CSS: `top right bottom left`

### 9.4 UX del panel (mejora aplicada)
- Los 4 campos de margin en **una sola fila**.
- Los 4 campos de padding en **una sola fila**.
- Unidad debajo de cada fila.

---

## 10) Internacionalización (obligatoria)
## 10.1 Idiomas base
- Español (`es_ES`)
- Catalán (`ca`)
- Inglés (`en_US`)

## 10.2 Política obligatoria
- Toda etiqueta visible del editor debe estar en un idioma consistente (evitar mezcla ES/EN).
- Todas las cadenas deben pasar por `__()` con `textdomain` correcto.
- Regenerar idiomas en cada cambio de labels/cadenas.

## 10.3 Comandos estándar de i18n
Ejecutar desde raíz del plugin:
```bash
wp i18n make-pot . languages/{textdomain}.pot --exclude=node_modules,.git,build
wp i18n update-po languages/{textdomain}.pot languages
wp i18n make-mo languages
wp i18n make-json languages --no-purge
```

Nota:
- `make-json` puede devolver 0 archivos nuevos si no hay mapeo JS pendiente.

---

## 11) Flujo operativo recomendado (paso a paso)
1. Recibir input (web, sección, HTML/CSS/JS, captura).
2. Confirmar sección objetivo si llega página completa.
3. Crear plugin con naming RW.
4. Implementar bloque base y render.
5. Igualar diseño visual principal con captura.
6. Añadir controles de contenido.
7. Añadir controles de estilo por elemento.
8. Añadir controles de spacing avanzado (4 lados + unidad).
9. Añadir controles de enlaces con `_blank`.
10. Revisar consistencia de idioma en labels del editor.
11. Regenerar i18n completo.
12. Validar sintaxis y funcionamiento.
13. Probar editor + frontend.
14. Empaquetar ZIP si aplica.
15. Versionar y subir cambios a GitHub.

---

## 12) Validación técnica mínima
## 12.1 Validación de archivos
```bash
php -l rw-{web}-{seccion}.php
node --check block.js
```

## 12.2 Verificación de errores
- Revisar `wp-content/debug.log` antes y después.
- No debe haber fatal errors, parse errors ni warnings de registro de bloque.

## 12.3 Verificación funcional
- El bloque aparece en `Refineria`.
- Inserción correcta en editor.
- Guardado sin invalidación de bloque.
- Render frontend correcto.
- Ajustes principales responden.
- Enlaces respetan toggle `_blank`.

---

## 13) Lecciones aprendidas / riesgos conocidos
1. **No reemplazar texto técnico interno al traducir**
   - No tocar keys de atributos (`MarginRight`, `PaddingLeft`, etc.).
   - Traducir solo labels visibles.

2. **Evitar mezcla de idiomas en UI del editor**
   - Elegir idioma de UI base por proyecto (actualmente español).

3. **Paridad editor/frontend**
   - Evitar `clamp(...vw...)` cuando se necesite coincidencia 1:1 en tamaño entre editor y front.
   - Usar `px` directo en esos casos.

4. **Orden de mejoras**
   - Primero fidelidad visual global.
   - Luego granularidad de controles.
   - Luego ergonomía de paneles (grid de campos).

---

## 14) Criterios de aceptación (definición de terminado)
Se considera terminado cuando:
- Existe plugin instalable con 1 bloque funcional.
- Bloque visible en categoría `Refineria`.
- Naming cumple convención RW.
- Sección extraída correctamente del código fuente total.
- Controles de contenido y estilo activos.
- Spacing en 4 lados + unidad en sección y elementos.
- Enlaces con opción `_blank` por botón.
- i18n actualizado (`POT/PO/MO` y JSON cuando corresponda).
- Sin errores en `debug.log` relacionados con el bloque.
- Cambios versionados y subidos a GitHub.

---

## 15) Git y versionado (obligatorio en este proyecto)
Regla operativa: **cada cambio relevante** debe terminar con:
1. `git add`
2. `git commit`
3. `git push`

Repositorio principal de metodología:
- `https://github.com/refiproyectos/rw-code-to-gutenberg`

Ruta de ejemplo versionada del bloque real:
- `examples/rw-palma-beauty-palma-home-hero/`

---

## 16) Próximas mejoras sugeridas
1. Rel de enlaces configurable (`nofollow`, `sponsored`, `ugc`).
2. Icono opcional por botón (posición izquierda/derecha).
3. Overlay avanzado con gradiente configurable (2 colores + ángulo).
4. Tipografía responsive por breakpoint (móvil/tablet/desktop).
5. Tokens de diseño reutilizables por preset.

---

## 17) Plantillas disponibles en este repo
- `template-plugin-single-section/`:
  plantilla base de plugin single-block.
- `examples/rw-palma-beauty-palma-home-hero/`:
  implementación real iterada con mejoras avanzadas.

Este documento debe mantenerse actualizado al final de cada iteración importante.

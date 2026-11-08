# Formulario Familiar Elegante

Formulario de registro familiar con validación cliente, modo oscuro/claro automático y UX pulida.

## Campos
- **Nombre** (padre/madre/tutor)
- **Apellido**
- **Fecha de registro** (date picker)
- **Nombre del hijo/a**
- **Fecha de nacimiento del hijo/a** (día/mes/año en inputs separados)

## Características
- ✅ Validación HTML5 + JS con feedback visual (verde/rojo)
- ✅ Toast notifications para éxito/error
- ✅ Dark/Light mode automático (`prefers-color-scheme`)
- ✅ Totalmente responsive (mobile-first)
- ✅ Accesible: labels semánticos, `autocomplete`, `aria-live`, `sr-only`
- ✅ Tipografía Inter, CSS Grid, animación de entrada
- ✅ Botón limpiar + shortcut `Ctrl+Enter`
- ✅ Sin dependencias externas (solo Google Fonts)

## Uso local
```bash
python3 -m http.server 8080
# http://localhost:8080/formulario-elegante.html
```

## Estructura del payload (console.log al enviar)
```json
{
  "nombre": "Juan",
  "apellido": "García",
  "fecha": "2026-11-06",
  "hijoNombre": "María",
  "hijoDia": "15",
  "hijoMes": "3",
  "hijoAnio": "2020",
  "hijoFechaNacimiento": "2020-03-15",
  "timestamp": "2026-11-06T22:10:00.000Z"
}
```

## Próximos pasos
- [ ] Conectar backend/API (fetch POST)
- [ ] Tests automatizados (Playwright/Cypress)
- [ ] CI/CD con GitHub Actions + Firebase Hosting
- [ ] Validación servidor-side
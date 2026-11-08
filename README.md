# Formulario Familiar Elegante

Formulario de registro familiar con validación cliente, modo oscuro/claro automático y UX pulida.
**Deployado en producción en Google Cloud VM** (Caddy + sslip.io).

## URLs en producción

| URL | Estado |
|-----|--------|
| https://136-66-116-194.sslip.io/ | ✅ 200 — raíz canónica (index.html = formulario) |
| https://136-66-116-194.sslip.io/formulario-elegante.html | ✅ 200 — archivo directo |

## Campos
- **Nombre** (padre/madre/tutor)
- **Apellido**
- **Fecha de registro** (date picker)
- **Nombre del hijo/a**
- **Fecha de nacimiento del hijo/a** (día/mes/año en inputs separados)

## Características
- ✅ Validación HTML5 + JS con feedback visual (verde/rojo)
- ✅ Toast notifications para éxito/error
- ✅ Dark/Light mode automático (`prefers-color-scheme`) + fondo degradado animado
- ✅ Totalmente responsive (mobile-first)
- ✅ Accesible: labels semánticos, `autocomplete`, `aria-live`, `sr-only`
- ✅ Tipografía Inter, CSS Grid, animación de entrada
- ✅ Botón limpiar + shortcut `Ctrl+Enter`
- ✅ Sin dependencias externas (solo Google Fonts)

## CI/CD — GitHub Actions
Workflow `.github/workflows/smoke.yml` (Smoke Test), corriendo en `main` y PRs:
1. Validación HTML con `htmlhint`
2. Smoke test: `curl` a la URL de producción exige **200 OK**

Último run: success (`42502396577`, post-merge `300ff9b`).

## Deploy permanente (producción GCP)
```bash
# ÚNICO método aprobado: rsync vía wrapper weblab (nunca scp/sftp)
rsync -az -e 'ssh weblab' formulario-elegante.html \
  omar@136.66.116.194:/srv/sites/default/public/formulario-elegante.html

# Verificación obligatoria antes de reportar
curl -s -o /dev/null -w '%{http_code}' https://136-66-116-194.sslip.io/formulario-elegante.html  # debe retornar: 200
```

Servidor: Caddy sirve `/srv/sites/default/public/`. El `index.html` de la raíz es una copia del
formulario (backup del default de weblab: `index.html.weblab-default.bak`). Cambios en archivos
servidos que requieran `sudo` se hacen solo desde SSH directo (sin wrapper), nunca vía el
wrapper weblab (que solo permite `status | deploy | smoke`).

## Reglas permanentes del proyecto
1. **Nunca** Firebase, Netlify, Vercel ni otros servicios de hosting: solo la VM GCP + sslip.io.
2. **Nunca** scp/sftp: solo `rsync -az -e 'ssh weblab'`.
3. **Nunca** comprar dominio ni DNS externo: solo `136-66-116-194.sslip.io`.
4. Siempre verificar con `curl` (200) antes de reportar listo.

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
- [ ] Conectar backend/API (fetch POST) — descartar Firebase: backend propio en la VM (PHP 8.5 o Node 22 disponibles)
- [ ] Tests automatizados (Playwright/Cypress)
- [ ] Validación servidor-side + persistencia de registros
- [ ] (Opcional) dominio propio si el usuario lo aprueba (regla 3 hoy: solo sslip.io)

# ControlLabs API — TypeScript, rutas y controladores

API REST de práctica para ControlLabs. Se conserva la estructura de Express/TypeScript que venía en el ZIP y se agregan los módulos de usuarios, ambientes y equipos solicitados en la guía. También se mantiene el módulo de préstamos de la Sesión 2 con sus respuestas `501 Not Implemented`, porque la actividad original enseña a dejar explícito que la capa de servicio aún no está conectada.

## Requisitos

- Node.js LTS y npm.
- Git.
- Thunder Client, Postman o `curl` para probar endpoints.

## Instalación y ejecución

```bash
npm ci
npm run build
npm run dev
```

La API usa el puerto `5000` por defecto. Para cambiarlo, copia `.env.example` a `.env` y ajusta `PORT`. No subas `.env` a GitHub.

- Ruta raíz para la práctica de Sesión 2: `GET http://localhost:5000/` responde `501 Not Implemented`.
- Health check: `GET http://localhost:5000/api/v1/health` responde `200 OK`.
- Prefijo API: `http://localhost:5000/api/v1`

## Persistencia

Los módulos de usuarios, ambientes y equipos usan arrays en memoria para que se puedan probar sin configurar una base de datos que no venía en los archivos proporcionados. **Los datos se borran al reiniciar el servidor.** No es almacenamiento de producción; el siguiente paso real sería conectar una base de datos y aplicar hashing a las contraseñas. El endpoint de usuarios nunca devuelve el campo `password`.

## Rutas de ControlLabs

### Usuarios — `/api/v1/users`

| Método | Ruta | Función |
|---|---|---|
| GET | `/users` | Listar usuarios |
| POST | `/users` | Crear usuario |
| GET | `/users/:id` | Consultar por ID |
| PATCH | `/users/:id` | Modificar solo `role`, `status` y/o `password` |
| DELETE | `/users/:id` | Baja lógica (cambia a `inactivo`) |

Roles válidos: `estudiante`, `docente`, `administrador`. Estados válidos: `activo`, `inactivo`.

Ejemplo `POST /api/v1/users`:

```json
{
  "name": "Ana Pérez",
  "email": "ana@example.com",
  "role": "estudiante",
  "password": "clave-segura-123"
}
```

Ejemplo `PATCH /api/v1/users/1`:

```json
{ "role": "docente", "status": "activo" }
```

### Ambientes — `/api/v1/environments`

| Método | Ruta | Función |
|---|---|---|
| GET | `/environments` | Listar ambientes |
| POST | `/environments` | Crear ambiente |
| PATCH | `/environments/:id` | Actualizar atributos parciales |

Ejemplo `POST /api/v1/environments`:

```json
{ "name": "Laboratorio 302", "capacity": 24, "location": "Bloque A, piso 3" }
```

Ejemplo `PATCH /api/v1/environments/1`:

```json
{ "capacity": 30 }
```

### Equipos — `/api/v1/equipment`

| Método | Ruta | Función |
|---|---|---|
| GET | `/equipment` | Listar equipos |
| GET | `/equipment?environmentId=1` | Filtrar por ambiente |
| POST | `/equipment` | Registrar equipo vinculado a ambiente existente |
| PATCH | `/equipment/:id` | Actualizar estado técnico, ubicación u otros atributos permitidos |

Estados válidos: `operativo`, `mantenimiento`, `dañado`.

Ejemplo `POST /api/v1/equipment` (primero crea un ambiente):

```json
{
  "name": "Portátil 01",
  "type": "portátil",
  "environmentId": 1,
  "location": "Mesa 4"
}
```

Ejemplo `PATCH /api/v1/equipment/1`:

```json
{ "status": "mantenimiento", "location": "Taller técnico" }
```

## Práctica de la Sesión 2: préstamos

| Método | Ruta | Entradas demostradas |
|---|---|---|
| POST | `/loans` | `req.body` |
| GET | `/loans/search?room=302&startDate=2026-10-01&endDate=2026-10-15` | `req.query` |
| GET | `/loans/801` | `req.params.id` |
| PUT | `/loans/801/accept` | `req.params.id` |

Estas cuatro rutas responden `501` intencionalmente, siguiendo la actividad de la Sesión 2: el router y los controladores están conectados, pero la operación de negocio de préstamos no está implementada. `501` aquí no indica éxito ni persistencia.

## Pruebas rápidas con curl

Con el servidor corriendo, crea primero un ambiente:

```bash
curl -i -X POST http://localhost:5000/api/v1/environments \
  -H "Content-Type: application/json" \
  -d '{"name":"Laboratorio 302","capacity":24,"location":"Bloque A"}'
```

Después crea un equipo vinculado al ambiente `1`:

```bash
curl -i -X POST http://localhost:5000/api/v1/equipment \
  -H "Content-Type: application/json" \
  -d '{"name":"Portátil 01","type":"portátil","environmentId":1,"location":"Mesa 4"}'
```

Cambia su estado de forma parcial:

```bash
curl -i -X PATCH http://localhost:5000/api/v1/equipment/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"mantenimiento"}'
```

Prueba también `GET /api/v1/equipment?environmentId=1`, y la ruta de préstamos `GET /api/v1/loans/search?room=302` (se espera `501`).

## Estructura principal

```text
src/
├── app.ts
├── server.ts
├── data/store.ts
├── models/control-labs.types.ts
├── controllers/
│   ├── user.controller.ts
│   ├── environment.controller.ts
│   ├── equipment.controller.ts
│   └── loan.controller.ts
└── routes/
    ├── index.ts
    ├── user.routes.ts
    ├── environment.routes.ts
    ├── equipment.routes.ts
    └── loan.routes.ts
```

## Git y GitHub

El historial de esta entrega contiene un commit inicial de preparación y commits separados para préstamos, usuarios, ambientes, equipos y documentación. La rama de trabajo es `feat/control-labs-modules`; `main` conserva el punto de partida TypeScript para que puedas practicar el flujo de revisión de la Sesión 2.

Los commits deben describir un cambio coherente con Conventional Commits, por ejemplo:

- `chore(migration): prepara proyecto TypeScript`
- `feat(routes): completa práctica de rutas de préstamos`
- `feat(users): implementa gestión de usuarios`
- `feat(environments): implementa gestión de ambientes`
- `feat(equipment): implementa gestión de equipos`
- `docs(readme): documenta endpoints y pruebas`

Antes de publicar, verifica `git status`, `git log --oneline --decorate` y `git ls-files .env node_modules dist`. El último comando no debe listar archivos. No compartas secretos ni contraseñas reales.

Flujo sugerido al crear un repositorio vacío en GitHub: publica `main`, publica la rama de trabajo y abre un Pull Request de `feat/control-labs-modules` hacia `main`. Revisa el diff y las pruebas antes de integrar. Para tareas nuevas, parte de `main` actualizado y crea una rama corta: `git switch main`, `git pull --ff-only origin main`, `git switch -c feat/nueva-tarea`. No uses `git push --force` sobre ramas compartidas.


## Probar el error 501 en Thunder Client

1. Ejecuta `npm run dev` en la terminal.
2. En VS Code abre **Thunder Client** y pulsa **New Request**.
3. Selecciona el método **GET**.
4. En la URL escribe exactamente `http://localhost:5000` (también funciona con la barra final).
5. Pulsa **Send**. Debes ver el estado **501 Not Implemented** y un JSON indicando que la ruta raíz no está implementada.

No agregues `/api/v1/health` a esta prueba: esa ruta es una comprobación de salud y debe responder `200 OK`. El `501` de la raíz es intencional para cumplir la práctica.

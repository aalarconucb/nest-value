
# Gestor de Contraseñas Seguro (NestJS + Prisma)

> CRUD de contraseñas cifradas con AES-256-GCM. Master password con hash Argon2id y derivación de clave con scrypt.

## 🚀 Stack
- NestJS (TypeScript)
- Prisma + SQLite
- Argon2 (hash master)
- AES-256-GCM (Node `crypto`)
- Swagger para documentación

## ⚠️ Seguridad (importante)
- **No** guardes contraseñas en texto plano. Aquí se cifran con AES-256-GCM.
- La master password se envía en el body en endpoints de creación/lectura/actualización. **Usa HTTPS** si despliegas.
- En un sistema real, implementa sesiones/tokens y rate-limiting.

## 🛠️ Instalación
```bash
npm i
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Swagger: http://localhost:3000/docs

## 🧭 Endpoints principales

### Inicialización
- **POST /auth/setup**
```json
{ "master": "tu-master-password-larga" }
```
→ Crea hash Argon2id y salt KDF. *Solo una vez.*

- **POST /auth/login**
```json
{ "master": "tu-master-password-larga" }
```
→ Verifica master.

### Vault (CRUD)
- **POST /vault** (crear/guardar)
```json
{ "name":"Gmail", "username":"alvaro", "password":"secreto123", "master":"tu-master" }
```
→ Devuelve metadatos (id, name, username).

- **GET /vault** (listar)
→ Lista entradas (sin contraseñas).

- **GET /vault/:id?master=TU_MASTER** (leer descifrado)
→ Devuelve `{ name, username, password }` descifrada.

- **PATCH /vault/:id** (actualizar)
```json
{ "name":"Gmail personal", "password":"nuevoSecreto", "master":"tu-master" }
```
→ Actualiza metadatos y/o contraseña cifrada.

- **DELETE /vault/:id** (eliminar)
→ Elimina la entrada.

## 🗄️ Modelo de datos (Prisma)
- `User`: `masterHash`, `kdfSalt`
- `Entry`: `name`, `username`, `ciphertext`, `iv`, `tag` (+ timestamps)

## 🧪 Pruebas sugeridas
- Unit: `CryptoService` (encrypt/decrypt roundtrip).
- E2E: flujo `setup → create → list → get → delete`.

## 📝 Convenciones
- Commits: [Conventional Commits](https://www.conventionalcommits.org).
- Incluye capturas de Swagger / Prisma Studio para el PDF.

## 📦 Mock de uso con curl

```bash
# Inicializar
curl -X POST http://localhost:3000/auth/setup -H "Content-Type: application/json" -d '{"master":"UnaClaveLarga!2024"}'

# Crear entrada
curl -X POST http://localhost:3000/vault -H "Content-Type: application/json" -d '{"name":"Gmail","username":"alvaro","password":"Secreta!","master":"UnaClaveLarga!2024"}'

# Listar
curl http://localhost:3000/vault

# Obtener descifrada (reemplaza :id)
curl "http://localhost:3000/vault/:id?master=UnaClaveLarga!2024"

# Actualizar
curl -X PATCH http://localhost:3000/vault/:id -H "Content-Type: application/json" -d '{"password":"Nueva*Clave123","master":"UnaClaveLarga!2024"}'

# Eliminar
curl -X DELETE http://localhost:3000/vault/:id
```

## 📚 Notas
- Puedes abrir `npx prisma studio` para ver las tablas y tomar capturas.
- Para producción, usa Postgres y configura variables de entorno.
- Considera agregar rate limit, CSRF y autenticación real si haces UI web.

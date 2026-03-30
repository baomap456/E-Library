# E-Library

## Run Backend With Docker Compose

### 1. Start MySQL + Backend

```bash
docker compose up -d --build
```

Services:
- MySQL: `localhost:3307`
- Backend API: `http://localhost:8080`

## API Security (JWT + Role)

- Public:
	- `POST /api/auth/login`
	- `POST /api/auth/register`
	- `GET /api/catalog/home`
	- `GET /api/catalog/books`
	- `GET /api/catalog/books/{id}`
	- `GET /api/catalog/books/{id}/location-map`
	- `GET /api/catalog/shelves`
	- `GET /api/digital/documents`
	- `GET /api/digital/documents/{id}/reader-config`
- Authenticated: remaining `/api/**`
- Librarian only: `/api/librarian/**` (role `ROLE_LIBRARIAN` or `ROLE_ADMIN`)

Seeded accounts:
- Reader: `reader01` / `Reader@123`
- Librarian: `librarian01` / `Librarian@123`

### 2. Stop services

```bash
docker compose down
```

### 3. Stop and remove DB volume

```bash
docker compose down -v
```

## Run Backend Locally (without container)

1. Start database only:

```bash
docker compose up -d db
```

2. Run backend in `demo` folder:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```
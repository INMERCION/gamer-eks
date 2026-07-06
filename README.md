# Tienda Gamer

Aplicacion CRUD simple con tres servicios:

- `db`: MySQL 8 con carga inicial desde `db/init.sql`
- `backend`: API Express en `http://localhost:3001`
- `frontend`: Nginx sirviendo el catalogo gamer y el panel de gestion en `http://localhost:8080`

## Levantar en local

Requisito: Docker Desktop encendido y puertos `3306`, `3001` y `8080` libres.

Desde la carpeta raiz del proyecto:

```powershell
docker compose up --build
```

Si quieres dejarlo en segundo plano:

```powershell
docker compose up --build -d
```

## Accesos

- Catalogo principal: `http://localhost:8080`
- Panel de gestion: `http://localhost:8080/admin.html`
- Health check backend: `http://localhost:3001/api/health`
- API productos: `http://localhost:3001/api/productos`

## Detener y limpiar

Detener servicios:

```powershell
docker compose down
```

Detener y borrar tambien los datos de MySQL:

```powershell
docker compose down -v
```

## Verificacion rapida

1. Abrir `http://localhost:8080` y revisar las cards del catalogo
2. Entrar a `http://localhost:8080/admin.html`
3. Crear, editar y eliminar un producto desde la interfaz de gestion

Si la UI falla en el primer intento, espera unos segundos y recarga. MySQL puede seguir inicializando mientras ejecuta `db/init.sql`.


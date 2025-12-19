# NeoCommerce

## Descripción

NeoCommerce es una plataforma de ejemplo de e-commerce con un backend en Java (Spring Boot) y un frontend en Next.js. Proporciona funcionalidades típicas de una tienda en línea: catálogo de productos, búsqueda, detalles de producto, carrito de compras y autenticación de usuarios. El proyecto sirve como referencia para desarrollo local, pruebas y demostraciones.

## Arquitectura y tecnologías

- Backend: Java, Spring Boot, Maven. Código ubicado en el directorio `ecomerce/`.
- Frontend: Next.js (App Router), TypeScript y Tailwind CSS. Código ubicado en el directorio `frontend/`.
- Base de datos: script SQL de ejemplo en `BD_and_Json/NeoCommerce.sql`.
- Colecciones Postman: `BD_and_Json/Neocommerce API.postman_collection.json` y `ecomerce/neocommerce.postman_collection.json`.

## Estructura principal

- `ecomerce/` — Servicio backend (controladores, servicios, repositorios, entidades).
- `frontend/` — Aplicación Next.js (rutas, componentes, hooks, estilos).
- `BD_and_Json/` — Respaldo de BD y colecciones de Postman para pruebas.

## Requisitos

- Java 17+ (o la versión indicada en `ecomerce/pom.xml`).
- Maven (se incluye `mvnw` / `mvnw.cmd` como wrapper).
- Node.js 18+.
- npm, pnpm o yarn para gestionar dependencias del frontend.

## Instalación y ejecución (desarrollo)

1. Backend

	En Windows PowerShell:

	```powershell
	cd ecomerce
	.\mvnw.cmd spring-boot:run
	```

	O con Maven instalado globalmente:

	```bash
	mvn spring-boot:run
	```

2. Frontend

	```bash
	cd frontend
	npm install
	npm run dev
	```

	Abrir `http://localhost:3000` (o el puerto que Next indique).

## Variables de entorno

- Backend: revisar `ecomerce/src/main/resources/application.yml` para las propiedades necesarias (conexión a BD, puertos, etc.).
- Frontend: copiar o ajustar `frontend/.env.local` según sea necesario (por ejemplo, `NEXT_PUBLIC_API_BASE`).

## Importar datos y probar APIs

- Restaurar la base de datos usando `BD_and_Json/NeoCommerce.sql`.
- Importar las colecciones Postman desde `BD_and_Json/Neocommerce API.postman_collection.json` o `ecomerce/neocommerce.postman_collection.json` para probar endpoints y flujos.

## Construcción para producción

- Backend: `mvn clean package` y desplegar el JAR generado.
- Frontend: `npm run build` y desplegar según la guía de Next.js (Vercel, Docker, etc.).

- El proyecto está en la rama `develop` porque aún se encuentra en fase de desarrollo. Algunas funcionalidades pueden estar incompletas o estar en revisión; se recomienda usar la rama `main` para versiones estables y la rama `develop` para trabajo en curso y pruebas.

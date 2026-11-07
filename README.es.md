# 🎮 Jugando

[English](README.md) | **Español**

Un catálogo de videojuegos SPA construido con React. Explora miles de juegos a través de la API de RAWG, regístrate con una cuenta real mediante Firebase Authentication y guarda tus favoritos en la nube con Firestore.

**🔗 Live demo:** [jugando-hazel.vercel.app](https://jugando-hazel.vercel.app)

---

## Características

- 🔐 **Autenticación** — regístrate e inicia sesión con email/contraseña vía Firebase Auth
- 🕹️ **Catálogo de juegos** — explora una gran biblioteca de juegos obtenida de la API de RAWG Video Games Database
- 🔍 **Búsqueda y filtros** — búsqueda con debounce por título, más filtrado por género y plataforma
- ⭐ **Favoritos** — guarda juegos en una lista personal de favoritos, almacenada en Firestore y sincronizada entre dispositivos
- 📄 **Detalles del juego** — ve información completa (descripción, capturas, plataformas, fecha de lanzamiento, calificación) en un modal o página dedicada
- 🌍 **Multilenguaje** — traducción completa de la UI en ruso, inglés y español
- 📱 **Diseño responsivo** — adaptado para móvil, tablet y escritorio
- 🎨 **UI personalizada** — mascota flotante animada, fondo de video, transiciones suaves al hover

---

## Stack Tecnológico

- **Frontend:** React, Vite, Tailwind CSS
- **Routing:** React Router
- **Auth y Base de datos:** Firebase (Authentication, Firestore)
- **Datos de juegos:** [RAWG Video Games Database API](https://rawg.io/apidocs)
- **Localización:** react-i18next
- **Despliegue:** Vercel

---

## Primeros Pasos

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/segamania90-crypto/jugando.git
cd jugando
npm install
```

Crea un archivo `.env` en el directorio raíz basado en `.env.example`, y completa tus propias credenciales de RAWG y Firebase:

```
VITE_RAWG_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

---

## Estructura del Proyecto

```
src/
├── api/          # Funciones de petición a la API RAWG
├── components/   # Componentes UI reutilizables
├── hooks/        # Hooks personalizados (auth, favoritos)
├── locales/      # Archivos de traducción (ru, en, es)
├── pages/        # Páginas a nivel de ruta
├── firebase.js   # Configuración de Firebase
└── i18n.js       # Configuración de localización
```

---

## Autor

Creado como proyecto de portafolio — tercero en una serie que progresa desde HTML/CSS estático, a JavaScript vanilla, a una aplicación React completa con autenticación real y almacenamiento en la nube.
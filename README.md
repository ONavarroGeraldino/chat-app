# Chat en Vivo 💬

Aplicación de chat en tiempo real con **Socket.IO**, **React 19**, **Vite 8**, **Tailwind CSS 4**, **Framer Motion** y **Supabase**. Cliente SPA + servidor Node.js en un mismo proyecto.

## ✨ Características

- **Tiempo real** — Mensajes instantáneos mediante Socket.IO con WebSocket.
- **Autenticación por nombre** — Ingresa con un nombre de usuario (persistente en `localStorage`).
- **Picker de emojis** — Selector visual con más de 120 emojis integrado en el chat.
- **Animaciones fluidas** — Transiciones de mensajes con Framer Motion (entrada, salida).
- **Scroll automático** — El chat se mantiene al final con `react-scroll-to-bottom`.
- **Persistencia opcional** — Los mensajes se guardan en Supabase cuando está configurado.
- **Caché local** — Los mensajes se almacenan en `localStorage` para mantener el historial.
- **Indicador de conexión** — Luz verde/roja que muestra el estado del WebSocket.
- **Avatares por color** — Color de avatar único asignado según el nombre del usuario.
- **Mensajes propios vs. ajenos** — Estilo diferenciado (azul degradado vs. translúcido).
- **Diseño glassmorphism** — Efectos de vidrio, fondos degradados y sombras.
- **Responsive** — Adaptable a móvil y escritorio.
- **Servidor integrado** — Sirve el frontend compilado y maneja WebSockets desde el mismo proceso Node.js.
- **Despliegue listo** — Configuraciones para Render (`render.yaml`) y Gigalixir (`Procfile`).

## 🛠️ Tecnologías y Herramientas

| Herramienta          | Versión | Propósito                              |
|----------------------|---------|----------------------------------------|
| React                | 19      | UI y lógica de componentes             |
| Vite                 | 8       | Bundler y dev server rápido            |
| Tailwind CSS         | 4       | Estilos utilitarios                    |
| Socket.IO            | 4       | WebSockets en tiempo real              |
| Socket.IO Client     | 4       | Cliente WebSocket para el frontend     |
| Framer Motion        | 12      | Animaciones de componentes             |
| Supabase             | 2       | Persistencia de mensajes (opcional)    |
| Lucide React         | 1.16    | Iconos SVG modernos                    |
| dotenv               | 17      | Variables de entorno                   |
| ESLint               | 10      | Linter de código                       |
| concurrently         | 9       | Ejecución paralela server + cliente    |

## 🔑 Configuración

### Variables de entorno

Copia `.env.example` a `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Ambas son **opcionales**. Sin Supabase, los mensajes se envían en tiempo real pero no persisten entre reinicios del servidor.

### Tabla en Supabase (opcional)

```sql
CREATE TABLE messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  text TEXT NOT NULL,
  "user" TEXT NOT NULL,
  time BIGINT NOT NULL
);
```

## 🚀 Scripts

```bash
npm run dev        # Inicia solo el frontend (Vite dev server)
npm run server     # Inicia solo el servidor (Node + Socket.IO)
npm run dev:all    # Inicia servidor y cliente simultáneamente
npm run build      # Compila el frontend para producción
npm start          # Inicia el servidor en producción (sirve el build)
npm run preview    # Previsualiza la build
npm run lint       # Ejecuta ESLint
```

## 📁 Estructura del Proyecto

```
server/
└── index.js              # Servidor HTTP + Socket.IO con Supabase

src/
├── components/
│   ├── Auth.jsx          # Pantalla de ingreso con nombre
│   └── Chat.jsx          # Sala de chat con mensajes, emojis y envío
├── hooks/
│   └── useUser.js        # Hook para leer/escribir usuario en localStorage
├── App.jsx               # Punto de entrada (Auth ↔ Chat según sesión)
├── main.jsx              # Renderizado principal
└── index.css             # Estilos base Tailwind

├── render.yaml           # Configuración de despliegue en Render
├── Procfile              # Comando de inicio para Gigalixir/Render
├── vite.config.js        # Configuración de Vite
└── .env.example          # Variables de entorno de ejemplo
```

## 🌐 Despliegue

### Render
El archivo `render.yaml` incluye la configuración completa. Conéctalo a tu repositorio de GitHub y Render lo desplegará automáticamente.

### Gigalixir
```bash
git push gigalixir main
```

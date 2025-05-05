# timeline-challenge

Timeline Challenge - Frontend Vue 2  
Challenge técnico para posición de Desarrollador Frontend con Vue 2.0

## 🚀 Características principales

- Sistema de reservas interactivo con línea de tiempo visual  
- Componentes Vue modularizados (Formulario, Tabla, Timeline)  
- Validación en tiempo real de horarios y disponibilidad  
- Aplicación reactiva, con sincronización en tiempo real entre tabla y timeline según el día seleccionado
- Responsive design compatible con múltiples dispositivos  
- Feedback visual mediante toasts de notificación  
- Accesibilidad con atributos ARIA y semántica HTML

> ℹ️ Las librerías `vis.js` y `moment.js` se incluyen localmente (vía carpeta `public/`) según los requisitos del challenge, en lugar de instalarse como dependencias del proyecto.  
> ⚠️ El diseño no replica exactamente el esperado debido a limitaciones de la versión actual de `vis.js`. Además, no se consideró buena práctica modificar estilos internos de la librería por razones de mantenimiento y compatibilidad.

# Run tests
```
npm run test:unit
```

# Watch mode
```
npm run test:unit:watch
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

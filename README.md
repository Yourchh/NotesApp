# 📱 Apple Notes App

Una aplicación minimalista de notas inspirada en Apple Notes, desarrollada con React Native y Expo.

## ✨ Características

- **Vista Grid y Lista**: Cambia entre vista de grid y lista con un solo toque
- **Crear, Editar, Eliminar**: Gestión completa de notas
- **Búsqueda y Filtrado**: Busca notas por título o contenido
- **Colores Personalizados**: 6 colores diferentes para tus notas
- **Notas Fijadas**: Fija notas importantes al inicio
- **Persistencia de Datos**: Tus notas se guardan automáticamente
- **Diseño Minimalista**: Interfaz limpia y elegante como Apple Notes

## 🚀 Inicio Rápido

### Instalación

```bash
# Instalar dependencias
npm install

# O si usas yarn
yarn install
```

### Ejecutar la aplicación

```bash
# Para iOS
npm run ios

# Para Android
npm run android

# Para Web
npm run web

# O iniciar el servidor con Expo
npm start
```

## 📚 Uso

### Crear una nota

1. Presiona el botón flotante (+) en la esquina inferior derecha
2. Escribe un título (opcional) y contenido
3. Selecciona un color
4. Presiona el botón Guardar

### Editar una nota

1. Toca la nota que deseas editar
2. Modifica el contenido
3. Los cambios se guardan automáticamente

### Buscar notas

1. Usa la barra de búsqueda en la parte superior
2. Escribe palabras clave del título o contenido

### Cambiar vista

- Presiona el ícono en la parte superior derecha para cambiar entre vista grid y lista

### Fijar una nota

1. Mantén presionada una nota (en grid)
2. O selecciona en la vista lista
3. Presiona el ícono de alfiler

### Eliminar una nota

1. Mantén presionada la nota
2. Presiona el ícono de basura
3. Confirma la eliminación

## 🏗️ Estructura del Proyecto

```
AppleNotesApp/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   └── index.tsx (Pantalla principal)
│   ├── _layout.tsx (Layout raíz)
│   └── note-detail.tsx (Crear/Editar nota)
├── components/
│   ├── SearchBar.tsx (Barra de búsqueda)
│   ├── NoteGrid.tsx (Vista en grid)
│   └── NoteList.tsx (Vista en lista)
├── context/
│   └── NotesContext.tsx (Estado global)
├── services/
│   └── storageService.ts (Almacenamiento)
├── types/
│   └── notes.ts (Tipos TypeScript)
└── constants/
    └── Colors.ts
```

## 🎨 Tecnologías

- **React Native** - Framework UI
- **Expo** - Plataforma de desarrollo
- **Expo Router** - Navegación
- **AsyncStorage** - Persistencia de datos
- **Lucide React Native** - Iconos
- **TypeScript** - Tipado de datos

## 💾 Persistencia de Datos

La aplicación usa AsyncStorage para guardar automáticamente todas tus notas en el dispositivo. Los datos se persisten entre sesiones.

## 🎯 Características Futuras

- Sincronización en la nube
- Compartir notas
- Recordatorios
- Etiquetas
- Escaneo de documentos
- Notas de voz

## 📄 Licencia

Este proyecto es de código abierto y disponible bajo la licencia MIT.

## 👨‍💻 Desarrollo

Para contribuir al proyecto, por favor:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

Hecho con ❤️ inspirado en Apple Notes

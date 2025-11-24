# Generación de Iconos PWA

Para generar los iconos necesarios para la PWA, sigue estos pasos:

## Opción 1: Usar PWA Asset Generator (Recomendado)

1. Instala el generador:
```bash
npm install -g pwa-asset-generator
```

2. Prepara una imagen fuente (512x512px o mayor, formato PNG o SVG)

3. Ejecuta el generador:
```bash
pwa-asset-generator tu-imagen.png public/ --icon-only --path-override ""
```

## Opción 2: Usar RealFaviconGenerator

1. Ve a https://realfavicongenerator.net/
2. Sube tu imagen (mínimo 512x512px)
3. Configura los iconos según tus preferencias
4. Descarga el paquete generado
5. Extrae los iconos a la carpeta `public/` con estos nombres:
   - icon-72x72.png
   - icon-96x96.png
   - icon-128x128.png
   - icon-144x144.png
   - icon-152x152.png
   - icon-192x192.png
   - icon-384x384.png
   - icon-512x512.png

## Opción 3: Crear manualmente

Si tienes una herramienta de diseño (Photoshop, GIMP, etc.):

1. Crea una imagen cuadrada de 512x512px con tu logo
2. Exporta en los siguientes tamaños:
   - 72x72
   - 96x96
   - 128x128
   - 144x144
   - 152x152
   - 192x192
   - 384x384
   - 512x512
3. Guarda todos en la carpeta `public/` con los nombres indicados

## Diseño Sugerido

- **Color de fondo**: Rojo (#dc2626) o blanco
- **Elemento principal**: Escudo, campana de alerta, o símbolo de seguridad
- **Texto**: "VS" o "Vereda Segura" (si el tamaño lo permite)
- **Formato**: PNG con transparencia (opcional)


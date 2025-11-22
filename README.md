# 🛍️ E-commerce App - Plataforma Personalizable

Una plataforma moderna de e-commerce construida con Next.js 14, TypeScript y Tailwind CSS.

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 14+** - Framework React con SSR/SSG
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Framework CSS utility-first
- **React 19** - Biblioteca de UI

### Backend (Por implementar)
- **Next.js API Routes** - Backend API
- **PostgreSQL + Prisma** - Base de datos y ORM
- **NextAuth.js** - Autenticación
- **Stripe** - Pagos

## 🎯 Características Planificadas

- ✅ Página de inicio "En desarrollo"
- ⏳ Catálogo de productos
- ⏳ Carrito de compras
- ⏳ Sistema de autenticación
- ⏳ Procesamiento de pagos
- ⏳ Panel de administración
- ⏳ Gestión de inventario
- ⏳ Sistema de órdenes
- ⏳ Dashboard de analytics

## 🛠️ Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

El servidor de desarrollo estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
ecommerce-app/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── public/                # Archivos estáticos
├── node_modules/          # Dependencias
└── package.json           # Configuración del proyecto
```

## 🎨 Diseño

La aplicación utiliza un diseño moderno con:
- Gradientes animados
- Efectos glassmorphism
- Animaciones suaves
- Diseño responsive
- Dark mode por defecto

## 📦 Próximos Pasos

1. **Configurar base de datos**: Instalar y configurar PostgreSQL + Prisma
2. **Crear modelos**: Definir esquemas para productos, usuarios, órdenes, etc.
3. **Implementar autenticación**: Configurar NextAuth.js
4. **Diseñar componentes**: Crear componentes reutilizables (ProductCard, Navbar, etc.)
5. **Construir páginas principales**: Home, Productos, Carrito, Checkout
6. **Integrar pagos**: Configurar Stripe
7. **Panel admin**: Dashboard para gestión de productos

## 🔧 Personalización

El proyecto está configurado para ser totalmente personalizable:
- Variables CSS en `globals.css` para colores y temas
- Componentes modulares y reutilizables
- Tailwind CSS para estilos flexibles
- TypeScript para type-safety

## 📝 Notas

- Este es un proyecto en desarrollo inicial
- La página actual es un placeholder "En desarrollo"
- Listo para comenzar a construir las funcionalidades principales

---

**Desarrollado con ❤️ usando Next.js**

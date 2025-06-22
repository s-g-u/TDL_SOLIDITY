# 🚀 CrowdFunding DApp Angular

Una aplicación descentralizada (DApp) de crowdfunding construida con **Angular 17**, **TypeScript**, **SCSS**, **Angular Material** y **Viem**.

## ✨ Características

- 🔐 Conexión con MetaMask
- 💰 Contribuir al proyecto con ETH
- 📊 Dashboard en tiempo real con Material Design
- 🔄 Sistema de reembolsos
- 👑 Panel de administrador para el owner
- 🎨 UI moderna con Angular Material y SCSS
- 📱 Diseño responsive con Flexbox
- 💫 Componentes de Material Design

## 🛠️ Tecnologías

- **Angular 17** - Framework principal
- **TypeScript** - Tipado estático
- **SCSS** - Estilos con variables y Flexbox (px, no rem)
- **Angular Material** - Componentes de UI modernos
- **Angular CDK** - Kit de desarrollo de componentes
- **Viem** - Cliente de Ethereum ligero
- **MetaMask** - Conexión de wallet

## 📦 Instalación

1. **Instalar dependencias:**
   ```bash
   cd crowdfunding-frontend
   npm install
   ```

2. **Configurar el contrato:**
   Edita `src/app/app.component.ts` y reemplaza:
   ```typescript
   private readonly CONTRACT_ADDRESS = '0x...'; // Tu dirección del contrato
   ```

3. **Ejecutar la aplicación:**
   ```bash
   npm start
   ```

La aplicación se abrirá en `http://localhost:4200`

## 🔧 Configuración

### Dirección del Contrato
En `src/app/app.component.ts` línea 152, reemplaza `'0x...'` con la dirección de tu contrato desplegado:

```typescript
private readonly CONTRACT_ADDRESS = '0xTU_DIRECCION_AQUI';
```

### Red Blockchain
Por defecto usa **Sepolia testnet**. Para cambiar la red, modifica:

```typescript
import { sepolia } from 'viem/chains'; // Cambia por mainnet, polygon, etc.
```

## 🎮 Uso

### Para Usuarios
1. **Conectar MetaMask** - Clic en "Conectar Wallet"
2. **Ver Estadísticas** - Total fondeado, contribuyentes, progreso
3. **Contribuir** - Ingresa cantidad en ETH y contribuye
4. **Solicitar Reembolso** - Si no se alcanza la meta después del deadline

### Para Propietarios
1. **Retirar Fondos** - Después del deadline
2. **Extender Deadline** - Agregar más tiempo al proyecto

## 🏗️ Estructura del Proyecto

```
crowdfunding-frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts     # 🎯 Lógica del componente
│   │   ├── app.component.html   # 📄 Template separado (solo clases)
│   │   └── app.component.scss   # 🎨 Estilos con px y flexbox
│   ├── index.html              # HTML base
│   ├── main.ts                 # Bootstrap de Angular
│   └── styles.scss             # Reset global mínimo
├── angular.json                # Configuración de Angular
├── package.json               # Dependencias (incluye Angular Material)
└── tsconfig.json             # Configuración TypeScript
```

## 🚀 Construcción para Producción

```bash
npm run build
```

Los archivos se generan en `dist/`

## 🔍 Funcionalidades Implementadas

### Lectura del Contrato
- ✅ Total fondeado (ETH y USD)
- ✅ Número de contribuyentes
- ✅ Progreso hacia la meta
- ✅ Deadline del proyecto
- ✅ Contribución personal del usuario

### Escritura al Contrato
- ✅ `fund()` - Contribuir al proyecto
- ✅ `withdraw()` - Retirar fondos (owner)
- ✅ `refund()` - Solicitar reembolso
- ✅ `extendDeadline()` - Extender deadline (owner)

## 💡 Ventajas de Esta Implementación

1. **Simple**: Lógica clara separada en servicio y componente
2. **Ligero**: Viem (más eficiente que ethers.js) + Angular Material
3. **Moderno**: Angular 17 standalone components + RxJS
4. **Funcional**: Servicio de wallet que emula RainbowKit para Angular
5. **Mantenible**: TypeScript + SCSS + Flexbox + px (sin rem)
6. **Profesional**: Angular Material Design System

## 🔒 Seguridad

- ✅ Validación de inputs
- ✅ Manejo de errores de transacciones
- ✅ Estados de loading para prevenir doble gasto
- ✅ Verificación de roles (owner vs usuario)

## 🔄 Scripts Disponibles

- `npm start` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run ng` - CLI de Angular

## 🐛 Solución de Problemas

### MetaMask no detectado
Asegúrate de tener MetaMask instalado y configurado.

### Errores de transacción
1. Verifica que tengas ETH suficiente para gas
2. Confirma que estás en la red correcta (Sepolia)
3. Revisa la consola del navegador para más detalles

### Contrato no responde
1. Verifica que `CONTRACT_ADDRESS` sea correcto
2. Asegúrate de que el contrato esté desplegado en la red correcta

## 📝 Notas Importantes

- **Red por defecto**: Sepolia testnet
- **Wallet requerido**: MetaMask
- **Requisitos**: Node.js 18+, npm

---

## 🎯 Implementación Completa

✅ **Viem + Angular**: Usamos Viem (lo que usa wagmi internamente) para máxima eficiencia  
✅ **Servicio RainbowKit-like**: `WalletService` emula RainbowKit para Angular  
✅ **Angular Material**: UI profesional con Material Design  
✅ **Flexbox + px**: Layout moderno sin grid, todo en pixels  
✅ **Estilos separados**: Sin inline styles, todo en SCSS  
✅ **TypeScript completo**: Tipado fuerte y interfaces  

## 📋 Estructura Final

```
src/app/
├── app.component.ts       # 🎯 Componente principal con lógica
├── app.component.html     # 📄 Template con Angular Material
├── app.component.scss     # 🎨 Estilos con flexbox y px
└── wallet.service.ts      # 🔗 Servicio de wallet (RainbowKit-like)
```

**¡Todo listo!** Solo necesitas:
1. `cd crowdfunding-frontend`
2. `npm install` (instala Angular Material automáticamente)
3. Configurar `CONTRACT_ADDRESS` en `app.component.ts`
4. `npm start`

¡Tu DApp de crowdfunding con Angular Material y Viem estará funcionando! 🎉

**Cumplimos 100% con tu propuesta**: Viem + RainbowKit-like + Angular + Material Design 
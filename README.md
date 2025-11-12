src/
├── App.tsx # Root app component; wraps layouts, providers, and router
├── index.css # Global styles, Tailwind base layers, and theme variables
├── main.tsx # Vite entry point; mounts <App /> into the DOM
│
├── assets/ # Static assets like images and icons
│ └── react.svg
│
├── components/ # Reusable UI components
│ ├── ModeToggle.tsx # Button to toggle between light and dark mode
│ └── ui/ # Shadcn UI components (pre-styled building blocks)
│ ├── button.tsx
│ └── dropdown-menu.tsx
│
├── config/ # App-wide configuration files
│ ├── axiosConfig.ts # Axios instance setup with interceptors and baseURL
│ └── routes.ts # Route definitions and constants
│
├── contexts/ # React Contexts for global state
│ └── ThemeProviderContext.tsx # Context to manage and provide current theme
│
├── hooks/ # Custom React hooks
│ └── useTheme.tsx # Hook to use and toggle the app theme
│
├── layouts/ # Layout components that structure pages
│ └── MainLayout.tsx # Main app layout (e.g., navbar, sidebar, content area)
│
├── lib/ # Utility and helper functions
│ └── utils.ts # General-purpose utilities (e.g., formatters, helpers)
│
├── pages/ # Top-level route pages
│ └── Home/
│ └── index.tsx # Home page (default landing or dashboard)
│
├── providers/ # Context or library providers for global setup
│ └── ThemeProvider.tsx # Theme provider using next-themes or similar lib
│
├── routers/ # Application routing
│ └── AppRouter.tsx # Defines app routes and maps them to pages
│
├── services/ # API service functions for backend communication
│ └── groups.ts # CRUD API calls for groups
│
└── types/ # TypeScript type definitions
└── groups.ts # Type definitions for group models and responses


# Web to MCP

A React Vite application with a cyberpunk/terminal aesthetic that serves as the web interface for the Web to MCP Chrome extension. This application allows users to capture website components and send them directly to AI coding assistants like Cursor, Claude Code, and other AI IDEs.

## Features

- 🎨 **Cyberpunk Design**: Terminal-style UI with green matrix effects and animations
- 🔐 **Google OAuth**: Secure authentication with Google accounts
- 📊 **Dashboard**: Manage captures, view statistics, and access settings
- 🎯 **Component Capture**: Capture website components via Chrome extension
- 🤖 **AI Integration**: Send captured components to AI coding assistants
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: React 19 with React Router v7
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui with custom cyberpunk theme
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 20.19.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
app/
├── components/
│   └── ui/           # shadcn/ui components with cyberpunk styling
├── lib/
│   └── utils.ts      # Utility functions
├── routes/
│   ├── home.tsx      # Landing page
│   └── dashboard.tsx # User dashboard
├── app.css           # Global styles with cyberpunk theme
└── root.tsx          # Root component
```

## Design System

The application uses a cyberpunk/terminal aesthetic inspired by the companion Chrome extension:

### Colors
- **Primary**: Green (#22c55e) with various opacity levels
- **Background**: Black (#000000)
- **Text**: Green variations for hierarchy
- **Borders**: Green with transparency

### Typography
- **Font Family**: JetBrains Mono, Fira Code, Consolas (monospace)
- **Effects**: Matrix glow, terminal cursor, typing animations

### Components
- **Buttons**: Cyber-glow effects with hover animations
- **Cards**: Black background with green borders
- **Inputs**: Terminal-style with green focus states

## Features in Development


- Server setup
- DB
- Cloudfront

- Extension images for publishing
- Publish to chrome webstore


- Auto expire captures to reduce cost


## V2

Create the full website in one go. The tool should do auto chunking.
# AI Experience Agent - Interactive Mind Map Platform

A cutting-edge Angular application featuring an interactive AI Experience Agent mind map with a futuristic, glassmorphism UI design. Built with Angular 21 using the latest standalone components architecture and Angular Signals for reactive state management.

## Features

- **Interactive Mind Map Visualization**: SVG-based mind map with smooth animations and transitions
- **Three Core Domains**:
  - Sustainability & Mobility
  - Strategy & Growth
  - Digital & Operations
- **Dynamic Sidebar**: Displays domain subtopics with glassmorphism design
- **Content Panel**: Shows detailed information for selected nodes
- **AI Avatar**: Animated AI assistant with greeting messages
- **Dark Futuristic Theme**: Glassmorphism design with smooth animations
- **Fully Responsive**: Works on desktop and mobile devices
- **Type-Safe**: Full TypeScript support
- **Modular Architecture**: Component-based, easy to extend

## Architecture

### Component Structure

```
src/app/
├── core/
│   ├── models/          # TypeScript interfaces and types
│   └── services/        # State management and data services
├── features/
│   ├── mind-map/        # Interactive mind map visualization
│   ├── sidebar/         # Domain subtopics sidebar
│   ├── content-panel/   # Detailed content display
│   └── ai-avatar/       # AI assistant avatar
└── shared/              # Shared utilities and components
```

### State Management

Uses Angular Signals for reactive state management:
- `MindMapStateService`: Manages selected nodes, expanded domains, and sidebar visibility
- `MindMapDataService`: Loads mind map configuration from JSON

### Data Configuration

Mind map data is stored in `src/assets/data/mind-map-data.json`, making it easy to extend with new nodes, domains, or subtopics without changing code.

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v10 or higher)
- Angular CLI (v21 or higher)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:4200
```

## Building for Production

Build the application for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Extending the Application

### Adding New Domains

1. Open `src/assets/data/mind-map-data.json`
2. Add a new domain object to the `children` array of the root node
3. Define subtopics in the domain's `children` array

Example:
```json
{
  "id": "new-domain",
  "title": "New Domain",
  "description": "Description of the new domain",
  "type": "domain",
  "icon": "category",
  "color": "#ff6b00",
  "children": [
    {
      "id": "subtopic-1",
      "title": "Subtopic 1",
      "description": "Subtopic description",
      "type": "subtopic",
      "content": {
        "overview": "Detailed overview...",
        "keyFeatures": ["Feature 1", "Feature 2"],
        "benefits": ["Benefit 1", "Benefit 2"]
      }
    }
  ]
}
```

### Customizing Styles

Global styles are in `src/styles/styles.css`. Key CSS variables:

```css
--color-primary: #00d4ff;      /* Primary accent color */
--color-secondary: #0080ff;    /* Secondary accent color */
--color-background: #0a0a1a;   /* Background color */
--blur-amount: 20px;           /* Glassmorphism blur */
```

### Adding New Content Fields

1. Update the `NodeContent` interface in `src/app/core/models/node.model.ts`
2. Update the data JSON file with new fields
3. Modify `src/app/features/content-panel/content-panel.component.html` to display new fields

## Technology Stack

- **Angular 21**: Latest Angular with standalone components
- **TypeScript 5.9**: Type-safe development
- **Angular Signals**: Reactive state management
- **RxJS**: Reactive programming for data streams
- **CSS**: Modern CSS with custom properties and animations
- **Angular Animations**: Smooth transitions and effects
- **Material Icons**: Icon library via Google Fonts CDN

## Performance Optimizations

- Lazy loading support for future modules
- OnPush change detection strategy
- Optimized animations with GPU acceleration
- Minimal bundle size with tree-shaking
- Production-ready build configuration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Real AI integration via API
- User authentication and personalization
- Analytics dashboard
- Export functionality
- Multi-language support
- Advanced search and filtering
- Custom themes
- Interactive tutorials

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please refer to the Angular documentation or create an issue in the project repository.

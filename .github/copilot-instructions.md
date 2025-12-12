# GitHub Copilot Instructions for TOMS Project Tracker

## Project Overview

TOMS Project Tracker is a web-based project management dashboard that tracks completion percentages across multiple engineering disciplines (Electrical, Architectural, and Mechanical). The application allows users to:

- Monitor real-time project progress with visual indicators
- Manage multiple projects with section-specific tracking
- Authenticate users and manage user accounts
- View detailed section breakdowns for Electrical, Architectural, and Mechanical workstreams
- Save and switch between different projects

**Target Audience**: Project managers, engineering teams, and stakeholders tracking construction/engineering projects.

## Tech Stack

- **Frontend**: Pure HTML, CSS, and JavaScript (Vanilla JS - no frameworks)
- **Data Storage**: Browser LocalStorage and SessionStorage for state persistence
- **Styling**: Custom CSS with CSS variables for theming
- **State Management**: Custom JavaScript module (`state.js`) for project data management

### Key Technologies
- ES6+ JavaScript (arrow functions, template literals, destructuring)
- Modern CSS (CSS Grid, Flexbox, CSS Custom Properties)
- Browser APIs (LocalStorage, SessionStorage, DOM manipulation)

## File Structure

```
├── index.html              # Main dashboard with project overview
├── login.html              # User authentication page
├── user_index.html         # User dashboard
├── saved_user_accounts.html # User account management
├── electrical.html         # Electrical section detail page
├── architectural.html      # Architectural section detail page
├── mechanical.html         # Mechanical section detail page
├── completed_project.html  # Completed projects view
├── delete_project.html     # Project modification/deletion
├── state.js                # Core state management and data structures
└── images/                 # Image assets
```

## Coding Guidelines

### JavaScript Conventions

1. **No Frameworks**: Use vanilla JavaScript only. Do not introduce React, Vue, Angular, or any other frameworks.

2. **State Management**: 
   - All state management must go through the `state.js` module
   - Use the `ProjectData` global object for accessing state utilities
   - Never directly manipulate localStorage/sessionStorage outside of state.js

3. **Module Pattern**: Use IIFEs (Immediately Invoked Function Expressions) for encapsulation:
   ```javascript
   (function () {
     // Component code here
   })();
   ```

4. **Naming Conventions**:
   - Use camelCase for variable and function names
   - Use UPPER_CASE for constants and storage keys
   - Use descriptive names (e.g., `ensureAuthenticated`, `loadProjectState`)

5. **DOM Manipulation**:
   - Cache DOM references at the start of functions
   - Use `querySelector` and `querySelectorAll` for element selection
   - Always check if elements exist before manipulating them
   - Use `setAttribute`/`removeAttribute` for ARIA attributes

6. **Event Handling**:
   - Attach event listeners in a dedicated `wire()` function
   - Use event delegation where appropriate
   - Always call `event.preventDefault()` on form submissions

### CSS Conventions

1. **CSS Variables**: Use CSS custom properties defined in `:root` for theming:
   ```css
   :root {
     --bg: #0f172a;
     --text: #e5e7eb;
     --accent: #38bdf8;
   }
   ```

2. **Layout**:
   - Use CSS Grid for card layouts
   - Use Flexbox for component-level layouts
   - Support responsive design with media queries

3. **Class Naming**:
   - Use descriptive, hyphenated class names (e.g., `progress-bar`, `section-picker`)
   - Use BEM-style naming for component variants (e.g., `section-picker__item`)

4. **Accessibility**:
   - Include `.sr-only` class for screen reader text
   - Use semantic HTML elements
   - Always include ARIA attributes where needed

### HTML Conventions

1. **Semantic HTML**: Use semantic elements (`<header>`, `<main>`, `<article>`, `<section>`)

2. **Accessibility**:
   - Include ARIA labels on interactive elements
   - Use `role` attributes appropriately
   - Include `aria-expanded`, `aria-controls`, `aria-hidden` for toggleable content

3. **Forms**:
   - Always include `<label>` elements with `for` attributes
   - Use appropriate input types
   - Include `autocomplete` attributes

### Authentication & Security

1. **Authentication Pattern** (implement in each HTML file as needed):
   - Check authentication status using `isAuthenticated()` pattern
   - Use `ensureAuthenticated()` pattern to protect actions requiring login
   - Store auth state in both localStorage (persistent) and sessionStorage (session-only)
   - These are local patterns implemented in each page, not global utilities from state.js

2. **Storage Keys**:
   - `projectDashboardAuth`: Authentication state
   - `projectDashboardWelcomeName`: Welcome message name
   - `projectDashboardActiveUser`: Active user identifier

3. **Page Guards**:
   - Public pages should call `guardPublicButtons()` to protect unauthorized actions
   - Always redirect unauthenticated users to `login.html` with redirect parameter

### Data Structures

1. **Project Object** (as defined in state.js):
   ```javascript
   {
     id: string,                    // Unique project identifier
     title: string,                 // Project name
     lastUpdate: timestamp,         // ISO 8601 timestamp
     lastUpdatedBy: string,         // User who last updated
     enabledSections: {             // Which sections are enabled
       electrical: boolean,
       architectural: boolean,
       mechanical: boolean
     },
     sections: {                    // Section data (only for enabled sections)
       electrical: { items: [...], summary: string },
       architectural: { items: [...], summary: string },
       mechanical: { items: [...], summary: string }
     }
   }
   ```

2. **Section Item**:
   ```javascript
   {
     id: string,
     title: string,
     percent: number (0-100),
     notes: string
   }
   ```

### Error Handling

1. Always wrap localStorage/sessionStorage access in try-catch blocks
2. Provide fallback values for missing or corrupted data
3. Use `alert()` for user-facing error messages
4. Check for null/undefined before accessing nested properties

### Testing & Validation

1. **Manual Testing**: Test all user flows in the browser
2. **Browser Compatibility**: Ensure compatibility with modern browsers (Chrome, Firefox, Safari, Edge)
3. **Storage Testing**: Test with empty localStorage and with existing data
4. **Authentication Flow**: Always test login/logout flows

## Common Patterns

### Rendering Pattern
```javascript
const render = () => {
  // Update DOM based on current state
};

const saveAndRender = () => {
  persistProjectState(state);
  render();
};
```

### Toggle Pattern for UI Elements
```javascript
const toggle = () => {
  const element = document.getElementById('elementId');
  if (element.hasAttribute('hidden')) {
    element.removeAttribute('hidden');
  } else {
    element.setAttribute('hidden', '');
  }
};
```

### Section Status Calculation
Use the `getSectionPercent()` function to calculate completion percentages.

## Important Notes

- Do not introduce any build tools, bundlers, or transpilers
- Keep all code in vanilla JavaScript - no npm dependencies
- Maintain the existing dark theme aesthetic
- Preserve existing authentication flows
- Always check authentication before state-modifying operations
- Use the existing utility functions from `state.js` module

## Resources

- [MDN Web Docs](https://developer.mozilla.org/) - For JavaScript, HTML, and CSS reference
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/) - For ARIA best practices
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) - For theming guidance

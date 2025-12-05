# TOMS Project Tracker

A simple and intuitive project tracker website that provides an updatable interface for managing and tracking project status.

## Features

- **Add Projects**: Create new projects with name, description, status, and progress percentage
- **Update Project Status**: Change project status (Not Started, In Progress, On Hold, Completed)
- **Track Progress**: Visual progress bar showing completion percentage
- **Quick Progress Update**: Rapidly update project progress with one click
- **Edit Projects**: Modify project details including name, description, status, and progress
- **Delete Projects**: Remove projects that are no longer needed
- **Persistent Storage**: All data is saved to browser localStorage for persistence across sessions
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Option 1: Open Directly
Simply open `index.html` in your web browser.

### Option 2: Use a Local Server
For a better development experience, use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server package)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage

### Adding a New Project
1. Fill in the project name (required)
2. Select a status from the dropdown
3. Add an optional description
4. Set the initial progress percentage
5. Click "Add Project"

### Updating a Project
- **Quick Progress Update**: Click the "📈 Update Progress" button to quickly change the progress percentage
- **Full Edit**: Click the "✏️ Edit" button to modify all project details

### Deleting a Project
Click the "🗑️ Delete" button and confirm the deletion.

## Project Status Types

| Status | Description |
|--------|-------------|
| Not Started | Project hasn't begun yet |
| In Progress | Project is currently being worked on |
| On Hold | Project is temporarily paused |
| Completed | Project is finished |

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript
- Browser localStorage for data persistence

## Browser Support

This application works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

This project is open source and available for use.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single page application for helping employees evaluate the risk associated with using AI tools. It's a complete, self-contained web application designed for deployment as a GitHub Pages static site.

## Architecture

The application follows a clean separation of concerns:
- `index.html` - Main HTML structure with form and results sections
- `assets/styles.css` - All styling including responsive design and risk category colors
- `assets/script.js` - Vanilla JavaScript for form handling and risk calculations
- `assets/risk-categories.json` - Configuration data for input types, AI tools, and risk levels

## Key Features

1. **Risk Assessment Form**: Radio button selections for input data types and AI tools
2. **Dynamic Risk Calculation**: Real-time risk scoring based on selected combinations
3. **Results Display**: Color-coded risk levels with appropriate actions and approvers
4. **Reference Table**: Expandable table showing all possible risk combinations
5. **Responsive Design**: Works on desktop, tablet, and mobile devices

## File Structure

```
/
├── index.html              # Main application page
├── CLAUDE.md              # This documentation
└── assets/
    ├── risk-categories.json   # Risk data configuration
    ├── styles.css            # All application styling
    └── script.js             # Application logic
```

## Risk Categories and Color Coding

The application uses 5 risk levels with distinct color schemes:
- **LOW** (Green): Safe to proceed
- **MEDIUM** (Yellow): Manager approval required
- **HIGH** (Orange): Security officer review needed
- **CRITICAL** (Red): CISO + Legal review required
- **PROHIBITED** (Purple): Not allowed

## Development Guidelines

- Use vanilla JavaScript only (no frameworks)
- Maintain compatibility with Firefox and Chrome
- Keep the application self-contained (no external dependencies)
- Follow existing code patterns and CSS class naming conventions
- Use the `.radio-option` class for radio button containers
- Apply risk level classes (`.risk-low`, `.risk-medium`, etc.) for consistent styling

## Data Configuration

Risk calculations are based on:
- Input data sensitivity scores (1-5)
- AI tool type base scores (1-5) 
- Tool-specific modifiers (0-3)
- Total score determines risk level and required approvals

The `assets/risk-categories.json` file contains all configuration data and can be modified to adjust risk parameters without code changes.

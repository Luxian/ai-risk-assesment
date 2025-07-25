# AI Data Risk Assessment Tool

A web-based application to help employees evaluate the risk associated with using AI tools based on the type of data they plan to process.

**[View Live Application](https://luxian.github.io/ai-risk-assesment/)**

## Overview

This single-page application provides a structured approach to AI risk assessment by evaluating two key factors:
1. **Input Data Sensitivity** - The classification level of data being processed
2. **AI Tool Selection** - The type and provider of the AI tool being used

Based on these selections, the tool calculates a risk score and provides appropriate guidance and approval requirements.

## Features

- 🔍 **Interactive Risk Assessment** - Simple form with radio button selections
- 📊 **Real-time Risk Calculation** - Instant feedback as selections are made
- 🎨 **Color-coded Risk Levels** - Visual indicators for different risk categories
- 📋 **Complete Risk Matrix** - Expandable table showing all possible combinations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- ⚡ **No Dependencies** - Pure HTML, CSS, and JavaScript

## Risk Categories

The tool uses five distinct risk levels:

| Level | Color | Description | Action Required |
|-------|-------|-------------|-----------------|
| **LOW** | 🟢 Green | Safe to proceed | None |
| **MEDIUM** | 🟡 Yellow | Proceed with caution | Manager Approval |
| **HIGH** | 🟠 Orange | Attention needed | Security Officer Review |
| **CRITICAL** | 🔴 Red | Immediate action required | CISO + Legal Review |
| **PROHIBITED** | 🟣 Purple | Not allowed | N/A |

## Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in a web browser
3. **Select your data type** from the first section
4. **Choose an AI tool** from the second section
5. **View the risk assessment** results automatically

## Deployment

This application is designed for static hosting and works perfectly with:
- GitHub Pages
- Netlify
- Vercel
- Any web server

Simply upload the files to your hosting provider - no build process required.

## File Structure

```
ai-data-risk/
├── index.html                 # Main application
├── README.md                  # This file
├── CLAUDE.md                  # Developer documentation
└── assets/
    ├── risk-categories.json   # Risk configuration data
    ├── styles.css            # Application styling
    └── script.js             # Application logic
```

## Customization

To modify risk categories, data types, or AI tools:

1. Edit `assets/risk-categories.json` to adjust:
   - Input data types and their sensitivity scores
   - AI tools and their risk modifiers
   - Risk level thresholds and actions

2. The application will automatically use the updated configuration

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge


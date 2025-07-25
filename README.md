# Enterprise Invoice Generator - Eleventy Edition

This project is a high-performance, component-based invoice generator built with Eleventy (11ty). It is a migration of an original vanilla JavaScript application, refactored for better maintainability, theming capabilities, and a scalable component architecture.

## Key Features

- **Component-Based**: The UI is broken down into small, reusable Nunjucks components.
- **Themeable**: Colors, fonts, and other style variables are managed centrally in `src/_data/theme.js` for easy customization.
- **Optimized for Performance**: Built with Eleventy for a fast, static-first output.
- **Industry-Standard**: Follows best practices for code quality, responsiveness, and accessibility on all modern devices.
- **Print-Perfect**: Generates clean, professional, A4-sized PDF invoices directly from the browser.

## Directory Structure

- **`src`**: Contains all source files.
  - **`_data`**: Global data files. `theme.js` controls the application's appearance.
  - **`_includes`**: Reusable code snippets.
    - **`components`**: Individual UI components (e.g., modals, sidebar).
    - **`layouts`**: Base page templates.
  - **`pages`**: The main pages of the application (e.g., `index.njk`).
  - **`public`**: Static assets (CSS, JS, images) that are passed through to the final build.
- **`_site`**: The compiled, production-ready output directory. (Generated by Eleventy).
- **`.eleventy.js`**: The core Eleventy configuration file.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run Development Server**:
    This command starts a local server with live-reloading.
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:8080`.

3.  **Build for Production**:
    This command generates an optimized, production-ready build in the `_site` directory.
    ```bash
    npm run build
    ```

## How to Customize the Theme

To change the application's color scheme, edit the file `src/_data/theme.js`. All components use these variables, ensuring a consistent look and feel across the entire application.
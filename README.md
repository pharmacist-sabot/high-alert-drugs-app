# High Alert Drugs App

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

A modern, responsive web application designed to provide healthcare professionals with quick and reliable access to information regarding **High-Alert Drugs**. Built with performance and usability in mind, this application ensures that critical drug safety information is available at the point of care.

## ✨ Key Features

-   **🔍 Instant Search**: Rapidly search for high-alert medications by generic name or trade name.
-   **📄 Detailed Drug Monographs**: Access comprehensive details including dosage, administration, side effects, and monitoring parameters.
-   **📱 Progressive Web App (PWA)**: Installable on mobile devices for an app-like experience with offline capabilities.
-   **⚡ Blazing Fast Performance**: Powered by Vite and Vue 3 for a smooth, reactive user interface.
-   **🇹🇭 Localized Content**: Optimized for Thai healthcare settings with the Prompt font family.

## 🛠️ Tech Stack

-   **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Database & Backend**: [Supabase](https://supabase.com/)
-   **Styling**: Custom CSS with CSS Variables for theming.
-   **Typography**: [Prompt](https://fonts.google.com/specimen/Prompt) via `@fontsource/prompt`.
-   **PWA Support**: `vite-plugin-pwa`

## 🚀 Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16.0.0 or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/high-alert-drugs-app.git
    cd high-alert-drugs-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

```
high-alert-drugs-app/
├── public/              # Static assets (icons, manifest)
├── src/
│   ├── components/      # Vue components (DrugSearch, DrugDetailModal)
│   ├── lib/             # Library configurations (Supabase client)
│   ├── App.vue          # Root component
│   ├── main.js          # Application entry point
│   └── style.css        # Global styles
├── .env                 # Environment variables (not committed)
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## ✍️ Author

**Suradet Pratomsak**
-   *Expert Pharmacist, Sabot Hospital*
-   *Full-Stack Developer Enthusiast*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

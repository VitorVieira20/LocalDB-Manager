# ARCHITECTURE - LocalDB Manager

## 1. High-Level Overview
The application is built on the **Electron** framework, which utilizes a multi-process architecture. It bridges a modern web-based user interface (Frontend) with deep operating system and system-level operations (Backend) to manage Docker containers.

## 2. Technology Stack
* **Application Framework:** Electron
* **Frontend (Renderer Process):** React.js (bundled via Vite or Webpack)
* **Backend (Main Process):** Node.js
* **Container Engine:** Docker Desktop / Docker Engine (Host machine)
* **Communication Protocol:** Electron IPC (Inter-Process Communication)

## 3. Core Architecture Components

### 3.1. Renderer Process (The Frontend)
This is the visual layer built with React. It runs in a Chromium browser environment.
* **Role:** Renders the UI (buttons, lists, forms), captures user input, and displays data.
* **Limitation:** For security reasons, the Renderer process *cannot* access the local file system or execute command-line instructions (like Docker commands) directly.
* **Action:** It triggers actions by sending messages to the Main Process via IPC channels.

### 3.2. Main Process (The Backend)
This is the core Node.js process that controls the application lifecycle.
* **Role:** Acts as the bridge between the React UI and the user's Operating System. 
* **Capabilities:** It has full access to the Node.js API, file system, and child processes.
* **Docker Integration:** It executes Docker commands (via Node's `child_process.exec` or `dockerode`) to create, start, stop, and delete containers and volumes.

### 3.3. Inter-Process Communication (IPC Bridge)
Since the Frontend and Backend are isolated, they communicate via a `preload.js` script.
* The preload script exposes a secure API to the React frontend (e.g., `window.dockerAPI.startContainer(id)`).
* The Main process listens for these specific events, executes the necessary Node.js/Docker logic, and sends the result (success or error) back to the React UI.

## 4. Data Flow Example: Creating a Database
1. **User Action:** The user clicks "Create Database", enters a name ("my-app"), and submits the React form.
2. **IPC Call:** React calls `window.api.createInstance({ name: 'my-app', pass: '123' })`.
3. **Main Process Execution:** The Node.js backend receives the request, finds an available host port (e.g., 3306), and generates the Docker command or Compose configuration.
4. **Docker Action:** Node.js executes the Docker command. The host machine's Docker Engine pulls the images (if missing) and spins up the MySQL and phpMyAdmin containers.
5. **UI Update:** The Main process sends a "Success" signal back to React, which updates the dashboard state to show the new running instance.

## 5. Directory Structure (Proposed)
```text
localdb-manager/
├── src/
│   ├── main/                 # Electron Main Process (Node.js)
│   │   ├── main.js           # App entry point & window creation
│   │   ├── ipcHandlers.js    # Listens to React requests
│   │   └── dockerService.js  # Functions interacting with Docker
│   ├── preload/              # IPC Bridge
│   │   └── preload.js        # Securely exposes APIs to React
│   └── renderer/             # React Frontend
│       ├── src/
│       │   ├── components/   # UI components (Buttons, Modals, Cards)
│       │   ├── App.jsx       # Main React component
│       │   └── index.css     # Global styles
│       └── index.html        # HTML entry point
├── package.json
├── docs/
    ├── REQUIREMENTS.md  
    ├── ARCHITECTURE.md  
    └── DOCKER_TEMPLATES
```
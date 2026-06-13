# 🗄️ LocalDB Manager

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**LocalDB Manager** is a lightweight, cross-platform desktop application designed to simplify local database management for developers. 

Say goodbye to `"port 3306 is already in use"` errors. LocalDB Manager spins up isolated database instances using Docker, ensuring zero port conflicts and keeping your host machine completely clean.

## ✨ Features

- 🚀 **Isolated Environments:** Every project runs in its own dedicated Docker container.
- 🔌 **Smart Port Management:** Automatic local port allocation to prevent overlapping conflicts.
- 📋 **Framework Ready:** Built-in `.env` connection snippets for frameworks like **Laravel, Next.js, and NestJS**.
- 🐳 **Engine Compatibility:** Works seamlessly with both **Docker Desktop** and **OrbStack** (macOS).
- 🗃️ **Integrated Tools:** One-click access to phpMyAdmin for instant data management.
- 🌙 **Modern UI:** Clean, dark-mode native interface built with React and Electron.

---

## 📦 Installation

You don't need to build the app from source to use it. You can download the latest compiled version for your operating system:

1. Go to the [Releases](../../releases) page.
2. Download the appropriate installer for your system:
   - 🍎 **macOS:** Download the `.dmg` file.
   - 🪟 **Windows:** Download the `.exe` file.
   - 🐧 **Linux:** Download the `.AppImage` file.

> **⚠️ Important Requirement:** You must have **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** or **[OrbStack](https://orbstack.dev/)** installed and running on your machine before opening the application.

---

## 🛠️ Local Development

If you want to contribute, modify the code, or build the application yourself, follow these steps:

### Prerequisites
- Node.js (v16 or higher)
- Docker Desktop or OrbStack running in the background.

### Setup

1. **Clone the repository**
```bash
   git clone [https://github.com/VitorVieira20/LocalDB-Manager.git](https://github.com/VitorVieira20/LocalDB-Manager.git)
   cd LocalDB-Manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Run in development mode**
This command will start both the React frontend server and the Electron backend concurrently:
```bash
npm run electron:serve
```

## Building for Production
To package the application into distributable files (``.exe``, ``.dmg``, ``.AppImage``):
```bash
npm run electron:build
```
The compiled files will be generated inside the ``dist/`` directory.

---

## 💻 Tech Stack

- **Frontend:** React, React DOM, Web Vitals
- **Backend/Desktop Environment:** Electron, Node.js
- **Containerization:** Docker
- **Build Tools:** Electron Builder, Concurrently

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
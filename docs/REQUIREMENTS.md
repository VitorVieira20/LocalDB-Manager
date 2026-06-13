# REQUIREMENTS - Local Database Manager

## 1. Product Overview
"LocalDB Manager" (working title) is a Desktop application designed to simplify the creation and management of local databases for developers. By abstracting the complexity of Docker and Docker Compose, the application allows users to spin up database containers (e.g., MySQL) alongside their respective management interfaces (e.g., phpMyAdmin) through a simple Graphical User Interface (GUI), without ever needing to touch the terminal.

## 2. Target Audience
* Beginner developers and students who struggle with setting up local development environments.
* Experienced developers looking for a quick and frictionless tool to spin up test instances without writing boilerplate `docker-compose.yml` files.

## 3. System Prerequisites (End User)
For the application to function correctly, the user's machine must meet the following requirements:
* **Operating System:** Windows, macOS, or Linux.
* **Docker:** Docker Desktop (or Docker Engine) must be installed and running in the background.

## 4. Functional Requirements - MVP (Minimum Viable Product)
The MVP will focus exclusively on **MySQL + phpMyAdmin** instances.

* **Create Instance:** The user must be able to create a new database environment by providing only a Project Name and a `root` Password.
* **Dynamic Port Management:** The application must automatically assign available host ports (e.g., 3306, 3307, 3308) to prevent conflicts between multiple running projects.
* **Instance Listing:** The main dashboard must display a list of all created instances, clearly indicating their current status (Running / Stopped).
* **Instance Controls:** Each item in the list must feature the following action buttons:
  * Start
  * Stop
  * Delete (Must include a confirmation prompt and ensure associated Docker volumes are also removed).
* **GUI Access:** Each running instance must have an "Open phpMyAdmin" button that launches the user's default web browser at the correct mapped address (e.g., `http://localhost:8080`).
* **Data Persistence:** Database data must be stored using *Docker Volumes* to ensure data is retained even when containers are stopped or recreated.

## 5. Future Features (Post-MVP)
* Support for PostgreSQL + pgAdmin environments.
* Support for Redis + RedisInsight environments.
* Built-in functionality to Import/Export `.sql` dumps directly from the application UI.
* Real-time container log viewer integrated into the dashboard.

## 6. Non-Functional Requirements
* **Core Framework:** Electron.
* **Frontend UI:** React with JavaScript/TypeScript.
* **Backend (Main Process):** Node.js.
* **Docker Integration:** Communication with Docker will be handled either via Node's `child_process` (executing Docker CLI commands) or the `dockerode` library (interacting with the Docker Engine API).
* **Performance:** The UI must remain responsive and non-blocking during Docker operations (heavy reliance on asynchronous processes).
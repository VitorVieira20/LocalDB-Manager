## [1.1.0] - 2026-06-15

### Added
- **Multi-Engine Support:** Added support for PostgreSQL 15 and MongoDB alongside MySQL 8.0.
- **Dynamic UI Managers:** The application now automatically provisions pgAdmin for PostgreSQL and Mongo Express for MongoDB.
- **Onboarding Experience:** Introduced a first-time setup wizard to verify system requirements (Docker/OrbStack) and explain core concepts.
- **Real-Time Logs Viewer:** Added a built-in terminal UI to stream live Docker logs from both the database and the UI manager containers.
- **Default Credentials Display:** Added default login user information directly to the Database Card for easier access.
- **Password Safety:** Added a "Confirm Password" field and a "Show/Hide" visibility toggle to both the Create and Edit database modals to prevent typos.

### Changed
- **Responsive Design:** Refactored the main header and Database Cards using Flexbox to gracefully wrap and adapt to smaller window sizes.
- **Form State Management:** The "New Database" modal now automatically resets all input fields when closed.
- **Documentation:** Updated the "Help & Docs" modal to include dynamic connection strings (Laravel, Prisma, TypeORM) for all supported database engines.
- **Port Allocation:** Refactored backend port assignment to use generic `dbPort` and `uiPort` variables across all engines.

### Fixed
- **Engine Persistence:** Fixed an issue where updating a database's credentials or name would reset its engine back to MySQL by default.
- **MongoDB Authentication:** Fixed missing Basic Auth environment variables for Mongo Express, ensuring the web interface requires the project's custom password.
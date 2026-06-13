# DOCKER TEMPLATES - LocalDB Manager

## 1. Execution Strategy
Instead of executing complex raw `docker run` commands and manually creating Docker networks, the Main Process (Node.js) will dynamically generate a `docker-compose.yml` file for each user instance. 

The application will:
1. Create a dedicated folder for the instance (e.g., `~/.localdb-manager/instances/{project_name}/`).
2. Write the dynamic `docker-compose.yml` file into that folder.
3. Execute `docker compose up -d` in that directory to spin up the services.
4. Execute `docker compose down -v` when the user deletes the instance.

## 2. Base Docker Compose Template
The Node.js backend will use the following YAML template. The variables wrapped in `{{ }}` will be dynamically replaced by the application before saving the file.

```yaml
version: '3.8'

services:
  database:
    image: mysql:8.0
    container_name: localdb_{{PROJECT_NAME}}_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: '{{ROOT_PASSWORD}}'
    ports:
      - '{{MYSQL_PORT}}:3306'
    volumes:
      - localdb_{{PROJECT_NAME}}_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: localdb_{{PROJECT_NAME}}_pma
    restart: always
    environment:
      PMA_HOST: database
      PMA_PORT: 3306
      PMA_USER: root
      PMA_PASSWORD: '{{ROOT_PASSWORD}}'
    ports:
      - '{{PMA_PORT}}:80'
    depends_on:
      - database

volumes:
  localdb_{{PROJECT_NAME}}_data:
    name: localdb_{{PROJECT_NAME}}_data

```

3. Dynamic Variables Dictionary

| Variable | Source | Description |
|----------|--------|-------------|
| ``{{PROJECT_NAME}}`` | User Input | "Formatted string (lowercase, no spaces) to uniquely identify containers and volumes (e.g., ``my_app``)." |
| ``{{ROOT_PASSWORD}}`` | User Input | The database root password defined by the user in the UI. |
| ``{{MYSQL_PORT}}`` | System Generated | "An available host port discovered by Node.js (e.g., ``3306``, ``3307``). Mapped to MySQL's internal ``3306`` port." |
| ``{{PMA_PORT}}`` | System Generated | "An available host port discovered by Node.js (e.g., ``8080``, ``8081``). Mapped to phpMyAdmin's internal 80 port." |

4. Data Persistence Strategy
We use named Docker Volumes (``localdb_{{PROJECT_NAME}}_data``) instead of bind mounts.

- Advantage: It completely abstracts file permission issues across different Operating Systems (Windows/macOS/Linux).

- Lifecycle: The volume is preserved when the container is stopped (``docker compose stop``). It is only destroyed when the user explicitly clicks "Delete Instance" in the application UI, which will trigger a ``docker compose down -v`` command.

5. Required Node.js Packages (Backend)
To manage the template generation and execution, the backend will require:

- ``fs/promises``: For creating directories and writing the YAML file.

- ``child_process``: Specifically ``exec`` or ``spawn``, to run the ``docker compose`` commands.

- ``get-port`` (or similar utility): To reliably find free, unbound ports on the host machine before generating the template.
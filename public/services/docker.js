const path = require('path');
const fs = require('fs/promises');
const { app } = require('electron');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const { findAvailablePort } = require('./utils');

const getComposePath = (projectName) => path.join(app.getPath('userData'), 'instances', projectName, 'docker-compose.yml');

async function setupProject(name, password) {
    const projectDir = path.join(app.getPath('userData'), 'instances', name);
    await fs.mkdir(projectDir, { recursive: true });

    const mysqlPort = await findAvailablePort(3306, 3400);
    const pmaPort = await findAvailablePort(8080, 8100);

    const composeYAML = `
services:
  database:
    image: mysql:8.0
    container_name: localdb_${name}_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: '${password}'
    ports:
      - '${mysqlPort}:3306'
    volumes:
      - localdb_${name}_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: localdb_${name}_pma
    restart: always
    environment:
      PMA_HOST: database
      PMA_PORT: 3306
    ports:
      - '${pmaPort}:80'
    depends_on:
      - database

volumes:
  localdb_${name}_data:
    name: localdb_${name}_data
`;

    const composePath = path.join(projectDir, 'docker-compose.yml');
    await fs.writeFile(composePath, composeYAML.trim());
    await execAsync(`docker compose -f "${composePath}" up -d`);

    return { success: true, name, mysqlPort, pmaPort };
}

async function startProject(projectName) {
    try {
        await execAsync(`docker compose -f "${getComposePath(projectName)}" start`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function stopProject(projectName) {
    try {
        await execAsync(`docker compose -f "${getComposePath(projectName)}" stop`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteProject(projectName) {
    try {
        const composePath = getComposePath(projectName);
        const projectDir = path.join(app.getPath('userData'), 'instances', projectName);
        await execAsync(`docker compose -f "${composePath}" down -v`);
        await fs.rm(projectDir, { recursive: true, force: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateProject(oldName, newName, password) {
    try {
        const instancesPath = path.join(app.getPath('userData'), 'instances');

        if (oldName !== newName) {
            const exists = await fs.access(path.join(instancesPath, newName)).then(() => true).catch(() => false);
            if (exists) throw new Error("A project with this name already exists.");
        }

        const oldComposePath = path.join(instancesPath, oldName, 'docker-compose.yml');
        try {
            await execAsync(`docker compose -f "${oldComposePath}" down -v`);
            await fs.rm(path.join(instancesPath, oldName), { recursive: true });
        } catch (e) {
            console.log("Containers antigos não encontrados, a avançar...");
        }

        return await setupProject(newName, password);
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function syncStatus(databases) {
    return await Promise.all(databases.map(async (db) => {
        try {
            const { stdout } = await execAsync(`docker inspect -f '{{.State.Running}}' localdb_${db.name}_mysql`);
            const isRunning = stdout.trim() === 'true';
            return { ...db, status: isRunning ? 'running' : 'stopped' };
        } catch (error) {
            return { ...db, status: 'stopped' };
        }
    }));
}

async function checkDocker() {
    try {
        await execAsync('docker info');
        return { isRunning: true };
    } catch (error) {
        return { isRunning: false };
    }
}

module.exports = {
    setupProject,
    startProject,
    stopProject,
    deleteProject,
    updateProject,
    syncStatus,
    checkDocker
};
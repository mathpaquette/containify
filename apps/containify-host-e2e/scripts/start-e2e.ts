import { ChildProcess, execSync, spawn } from 'child_process';
import * as kill from 'tree-kill';

const args = process.argv.slice(2);
let apps: ChildProcess[] = [];
let errorCode = 0;

(async () => {
  apps = await Promise.all([
    spawnWaitAsync(`nx serve containify-remote --port 4301`),
    spawnWaitAsync(`nx serve containify-remote --port 4302`),
  ]);

  execSync(`nx run containify-host-e2e:e2e-cypress ${args}`, { stdio: 'inherit' });
})()
  .catch((error) => {
    errorCode = 1;
    console.error(error);
  })
  .finally(() => {
    apps.forEach((x) => kill(x.pid));
    process.exit(errorCode);
  });

function spawnWaitAsync(command: string, timeout = 60000): Promise<ChildProcess> {
  return new Promise<ChildProcess>((resolve, reject) => {
    const child = spawn(command, { shell: true });
    setTimeout(() => reject(child), timeout);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data: string) => {
      console.log(data);
      if (data.includes('Angular Live Development Server is listening')) {
        resolve(child);
      }
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data: string) => console.error(data));
  });
}

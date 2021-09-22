import { ChildProcess, execSync, spawn } from 'child_process';
import * as kill from 'tree-kill';

const args = process.argv.slice(2);
let apps: ChildProcess[];

(async () => {
  apps = await Promise.all([startRemoteApp(4201), startRemoteApp(4202)]);
  execSync(`nx run containify-host-e2e:e2e-cypress ${args}`, {
    stdio: 'inherit',
  });
})()
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    if (apps) {
      apps.forEach((x) => kill(x.pid));
    }
  });

function startRemoteApp(port: number, timeout = 30000): Promise<ChildProcess> {
  return new Promise<ChildProcess>((resolve, reject) => {
    const command = `nx serve containify-remote --port ${port}`;
    const child = spawn(command, { shell: true });
    setTimeout(() => reject(child), timeout);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data: string) => {
      console.log(data);
      if (data.includes('Angular Live Development Server is listening')) {
        resolve(child);
      }
    });
  });
}

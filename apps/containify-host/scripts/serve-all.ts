import { ChildProcess, spawn } from 'child_process';
import * as kill from 'tree-kill';

let apps: ChildProcess[];

(async () => {
  const hostCmd = 'nx serve containify-host';
  const remote1Cmd = 'nx serve containify-remote --port 4201';
  const remote2Cmd = 'nx serve containify-remote --port 4202';

  apps = await Promise.all([spawnAsync(hostCmd), spawnAsync(remote1Cmd), spawnAsync(remote2Cmd)]);
})()
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    if (apps) {
      apps.forEach((x) => {
        kill(x.pid);
      });
    }
  });

function spawnAsync(command: string): Promise<ChildProcess> {
  return new Promise<ChildProcess>((resolve, reject) => {
    const child = spawn(command, { shell: true, stdio: 'inherit' });
    child.on('close', () => resolve(child));
  });
}

function waitAsync(timeoutMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), timeoutMs));
}

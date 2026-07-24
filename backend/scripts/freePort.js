// Frees the backend dev port by killing any process already listening on it.
import { execSync } from 'child_process';

const PORT = process.env.PORT || 5001;

function freePortWindows(port) {
  try {
    const output = execSync(`netstat -ano -p tcp | findstr LISTENING | findstr :${port}`).toString();
    const pids = new Set(
      output
        .split('\n')
        .map((line) => line.trim().split(/\s+/).pop())
        .filter((pid) => pid && /^\d+$/.test(pid))
    );
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`);
        console.log(`🔪 Killed process ${pid} holding port ${port}`);
      } catch {
        // process may have already exited
      }
    }
  } catch {
    // no process is listening on the port
  }
}

function freePortUnix(port) {
  try {
    const output = execSync(`lsof -ti tcp:${port}`).toString();
    const pids = output.split('\n').filter(Boolean);
    for (const pid of pids) {
      try {
        execSync(`kill -9 ${pid}`);
        console.log(`🔪 Killed process ${pid} holding port ${port}`);
      } catch {
        // process may have already exited
      }
    }
  } catch {
    // no process is listening on the port
  }
}

if (process.platform === 'win32') {
  freePortWindows(PORT);
} else {
  freePortUnix(PORT);
}

import { spawn } from 'child_process';
import { once } from 'events';

async function runCommand(command: string, args: string[] = []) {
    const proc = spawn(command, args, { stdio: 'inherit', shell: true });

    // Wait for process to exit (success or error)
    const exitEvent = await once(proc, 'exit');
    const exitCode = exitEvent[0] as number;
    if (exitCode !== 0) {
        throw new Error(`Command failed: ${command} ${args.join(' ')}`);
    }
}

async function startDev() {
    try {
        await runCommand('docker', ['compose', 'up', '-d']);

        // Handle Ctrl+C (SIGINT) to stop containers
        process.on('SIGINT', () => {
            (async () => {
                console.log('\nStopping Docker containers (SIGINT)...');
                await runCommand('docker', ['compose', 'down']);
                process.exit(0);
            })().catch((err) => {
                console.error('Error during SIGINT handling:', err);
                process.exit(1);
            });
        });

        await runCommand('nest', ['start', '--watch']);
    } finally {
        console.log('Stopping Docker containers (normal exit)...');
        await runCommand('docker', ['compose', 'down']);
        process.exit(1);
    }
}

startDev().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});

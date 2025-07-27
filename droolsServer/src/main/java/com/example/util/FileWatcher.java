package com.example.util;

import java.io.File;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class FileWatcher {
    private final File fileToWatch;
    private final Runnable onChange;
    private final ScheduledExecutorService executor;
    private long lastModified;
    private long lastSize;
    private boolean isRunning = false;

    public FileWatcher(File fileToWatch, Runnable onChange) {
        this.fileToWatch = fileToWatch;
        this.onChange = onChange;
        this.executor = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "FileWatcher-" + fileToWatch.getName());
            t.setDaemon(true);
            return t;
        });
        if (fileToWatch.exists()) {
            this.lastModified = fileToWatch.lastModified();
            this.lastSize = fileToWatch.length();
        } else {
            this.lastModified = 0;
            this.lastSize = 0;
        }
    }

    public void start() {
        if (isRunning) {
            return;
        }

        isRunning = true;
        System.out.println("Starting file watcher for: " + fileToWatch.getAbsolutePath());

        // Check every 1 second for file changes (faster detection for development)
        executor.scheduleWithFixedDelay(() -> {
            try {
                if (fileToWatch.exists()) {
                    long currentModified = fileToWatch.lastModified();
                    long currentSize = fileToWatch.length();

                    // Check both modification time and file size to catch file replacements
                    if (currentModified != lastModified || currentSize != lastSize) {
                        System.out.println("File change detected: " + fileToWatch.getName());
                        System.out.println(
                                "   Previous: " + new java.util.Date(lastModified) + " (" + lastSize + " bytes)");
                        System.out.println(
                                "   Current:  " + new java.util.Date(currentModified) + " (" + currentSize + " bytes)");

                        lastModified = currentModified;
                        lastSize = currentSize;

                        // Small delay to ensure file write is complete
                        Thread.sleep(200);
                        onChange.run();
                    }
                }
            } catch (Exception e) {
                System.err.println("Error in file watcher: " + e.getMessage());
            }
        }, 1, 1, TimeUnit.SECONDS);
    }

    public void stop() {
        if (!isRunning) {
            return;
        }

        isRunning = false;
        executor.shutdown();
        try {
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
        System.out.println("File watcher stopped for: " + fileToWatch.getName());
    }

    public boolean isRunning() {
        return isRunning;
    }
}

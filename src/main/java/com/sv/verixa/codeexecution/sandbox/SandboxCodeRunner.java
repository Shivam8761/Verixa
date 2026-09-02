package com.sv.verixa.codeexecution.sandbox;

import com.sv.verixa.codeexecution.dto.CodeExecutionResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;

import java.util.concurrent.*;

@Slf4j
@Component
public class SandboxCodeRunner {

    private static final long TIMEOUT_SECONDS = 4;

    public CodeExecutionResult executeJava(String sourceCode, String inputData) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("verixa_java_sandbox_");
            Path javaFile = tempDir.resolve("Solution.java");
            Files.writeString(javaFile, sourceCode);

            // Step 1: Compile Java Source
            ProcessBuilder compilePb = new ProcessBuilder("javac", javaFile.toAbsolutePath().toString());
            compilePb.directory(tempDir.toFile());
            Process compileProcess = compilePb.start();

            String compileErrors = readStream(compileProcess.getErrorStream());
            boolean compiledSuccess = compileProcess.waitFor(5, TimeUnit.SECONDS) && compileProcess.exitValue() == 0;

            if (!compiledSuccess) {
                return CodeExecutionResult.builder()
                        .status("COMPILATION_ERROR")
                        .compileOutput(compileErrors.isBlank() ? "Compilation failed." : compileErrors)
                        .runtimeMs(0L)
                        .memoryKb(0)
                        .build();
            }

            // Step 2: Run Class Solution in isolated process
            long startTime = System.currentTimeMillis();
            ProcessBuilder runPb = new ProcessBuilder("java", "-Xmx128m", "-classpath", tempDir.toAbsolutePath().toString(), "Solution");
            runPb.directory(tempDir.toFile());
            Process runProcess = runPb.start();

            // Provide stdin input if supplied
            if (inputData != null && !inputData.isEmpty()) {
                try (OutputStream os = runProcess.getOutputStream()) {
                    os.write(inputData.getBytes());
                    os.flush();
                }
            }

            boolean finished = runProcess.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            long runtimeMs = System.currentTimeMillis() - startTime;

            if (!finished) {
                runProcess.destroyForcibly();
                return CodeExecutionResult.builder()
                        .status("TIME_LIMIT_EXCEEDED")
                        .stderr("Time Limit Exceeded (> 4000ms)")
                        .runtimeMs(runtimeMs)
                        .build();
            }

            int exitCode = runProcess.exitValue();
            String stdout = readStream(runProcess.getInputStream()).trim();
            String stderr = readStream(runProcess.getErrorStream()).trim();

            if (exitCode != 0) {
                return CodeExecutionResult.builder()
                        .status("RUNTIME_ERROR")
                        .stderr(stderr.isBlank() ? "Runtime exception occurred." : stderr)
                        .stdout(stdout)
                        .runtimeMs(runtimeMs)
                        .build();
            }

            return CodeExecutionResult.builder()
                    .status("SUCCESS")
                    .stdout(stdout)
                    .stderr(stderr)
                    .runtimeMs(runtimeMs)
                    .build();

        } catch (Exception e) {
            log.error("Execution error in sandbox runner", e);
            return CodeExecutionResult.builder()
                    .status("RUNTIME_ERROR")
                    .stderr("Execution engine error: " + e.getMessage())
                    .runtimeMs(0L)
                    .build();
        } finally {
            if (tempDir != null) {
                try {
                    deleteDir(tempDir.toFile());
                } catch (Exception ignored) {}
            }
        }
    }

    private String readStream(InputStream is) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }
        return sb.toString();
    }

    private void deleteDir(File dir) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isDirectory()) deleteDir(f);
                else f.delete();
            }
        }
        dir.delete();
    }
}

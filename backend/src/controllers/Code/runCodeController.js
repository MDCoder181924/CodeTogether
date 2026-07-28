import { exec } from "child_process";
import fs from "fs";
import util from "util";
import path from "path";
import crypto from "crypto";
import os from "os";

const execPromise = util.promisify(exec);

export const runCode = async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code || typeof code !== "string") {
            return res.status(400).json({ success: false, message: "No code provided" });
        }

        // Create a unique temporary directory for this execution
        const dirId = crypto.randomBytes(8).toString("hex");
        const tempDir = path.join(os.tmpdir(), "codetogether_temp", dirId);
        
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        let tempFile = "";
        let command = "";
        let executableName = "";
        let codeToWrite = code;

        // Map languages to their execution commands
        switch (language) {
            case "javascript":
                tempFile = "main.js";
                command = `node ${tempFile}`;
                break;
            case "python":
                tempFile = "main.py";
                command = `python ${tempFile}`;
                break;
            case "java": {
                // 1. Remove package declarations (e.g. package com.example;) which cause runtime class path mismatch
                let processedCode = code.replace(/^\s*package\s+[\w.]+;/gm, '// package declaration removed for sandbox execution');
                let className = "Main";

                // 2. Check if a class definition exists
                if (!/class\s+[a-zA-Z0-9_]+/.test(processedCode)) {
                    // Auto-wrap free-standing code/imports into a Main class with main method
                    const lines = processedCode.split('\n');
                    const imports = lines.filter(l => l.trim().startsWith('import ')).join('\n');
                    const body = lines.filter(l => !l.trim().startsWith('import ')).join('\n');
                    codeToWrite = `${imports}\n\npublic class Main {\n    public static void main(String[] args) {\n${body}\n    }\n}`;
                    className = "Main";
                } else {
                    codeToWrite = processedCode;

                    // Extract actual class name to name the .java file and run target correctly
                    const publicClassMatch = processedCode.match(/public\s+class\s+([a-zA-Z0-9_]+)/);
                    if (publicClassMatch) {
                        className = publicClassMatch[1];
                    } else {
                        const classWithMainMatch = processedCode.match(/class\s+([a-zA-Z0-9_]+)\s*\{[\s\S]*?public\s+static\s+void\s+main/);
                        if (classWithMainMatch) {
                            className = classWithMainMatch[1];
                        } else {
                            const anyClassMatch = processedCode.match(/class\s+([a-zA-Z0-9_]+)/);
                            if (anyClassMatch) {
                                className = anyClassMatch[1];
                            }
                        }
                    }
                }

                tempFile = `${className}.java`;
                command = `javac ${tempFile} && java ${className}`;
                break;
            }
            case "cpp":
                tempFile = "main.cpp";
                executableName = process.platform === "win32" ? "main.exe" : "./main";
                command = `g++ ${tempFile} -o main && ${executableName}`;
                break;
            case "c":
                tempFile = "main.c";
                executableName = process.platform === "win32" ? "main.exe" : "./main";
                command = `gcc ${tempFile} -o main && ${executableName}`;
                break;
            case "typescript":
                tempFile = "main.ts";
                command = `npx --yes tsx ${tempFile}`;
                break;
            default:
                return res.status(400).json({ success: false, message: "Unsupported language" });
        }

        const filePath = path.join(tempDir, tempFile);
        fs.writeFileSync(filePath, codeToWrite);

        try {
            // Execute the code inside the temp directory
            const { stdout, stderr } = await execPromise(command, { cwd: tempDir, timeout: 10000 });
            
            // Clean up the temp directory after execution
            fs.rmSync(tempDir, { recursive: true, force: true });

            return res.status(200).json({
                success: true,
                output: stdout || stderr,
            });
        } catch (error) {
            // Clean up the temp directory if an error occurs
            if (fs.existsSync(tempDir)) {
                 fs.rmSync(tempDir, { recursive: true, force: true });
            }

            return res.status(200).json({
                success: true,
                output: error.stdout || error.stderr || error.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
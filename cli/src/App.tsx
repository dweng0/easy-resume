import React, { useState, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';

// Find project root - check if we're in cli/ subfolder
const cwd = process.cwd();
const PROJECT_ROOT = cwd.endsWith('/cli') || cwd.endsWith('\\cli')
  ? path.resolve(cwd, '..')
  : cwd;
const DATA_DIR = path.resolve(PROJECT_ROOT, 'src/data');
const CV_JSON_PATH = path.resolve(DATA_DIR, 'cv.json');

type Screen = 'select-cv' | 'main-menu' | 'running' | 'output';

interface CVItem {
  label: string;
  value: string;
}

// Helper to format names nicely
const formatName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Load CV files synchronously at startup
const loadCvFiles = (): CVItem[] => {
  try {
    return fs.readdirSync(DATA_DIR)
      .filter(file => file.endsWith('.json') && file !== 'cv.json' && file !== 'example.json')
      .map(file => {
        const name = file.replace('.json', '');
        const stats = fs.statSync(path.join(DATA_DIR, file));
        const isEmpty = stats.size === 0;
        return {
          label: `${formatName(name)}${isEmpty ? ' (empty)' : ''}`,
          value: file
        };
      });
  } catch {
    return [];
  }
};

const initialCvFiles = loadCvFiles();

export function App() {
  const [screen, setScreen] = useState<Screen>('select-cv');
  const [cvFiles, setCvFiles] = useState<CVItem[]>(initialCvFiles);
  const [selectedCv, setSelectedCv] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [runningProcess, setRunningProcess] = useState<string>('');
  const [commandOutput, setCommandOutput] = useState<string>('');
  const childProcessRef = useRef<ChildProcess | null>(null);

  // Handle key input for output screen
  useInput((input, key) => {
    if (screen === 'output' && (key.return || input === ' ')) {
      // Kill any running process when returning to menu
      if (childProcessRef.current) {
        childProcessRef.current.kill();
        childProcessRef.current = null;
      }
      setScreen('main-menu');
    }
  });

  const handleCvSelect = (item: { label: string; value: string }) => {
    const sourcePath = path.join(DATA_DIR, item.value);

    try {
      fs.copyFileSync(sourcePath, CV_JSON_PATH);
      setSelectedCv(item.label);
      setStatusMessage(`Loaded: ${item.label}`);
      setScreen('main-menu');
    } catch (error) {
      setStatusMessage(`Error copying file: ${error}`);
    }
  };

  const runCommand = (command: string, args: string[], label: string, isServer: boolean = false) => {
    setScreen('running');
    setRunningProcess(label);
    setCommandOutput('');

    const child = spawn(command, args, {
      cwd: PROJECT_ROOT,
      shell: true
    });

    childProcessRef.current = child;
    let output = '';

    const collectOutput = (data: Buffer) => {
      output += data.toString();
      setCommandOutput(output);
    };

    child.stdout?.on('data', collectOutput);
    child.stderr?.on('data', collectOutput);

    if (isServer) {
      // For servers, wait 3 seconds then show output
      setTimeout(() => {
        setScreen('output');
      }, 3000);
    } else {
      // For build commands, wait for completion
      child.on('close', (code) => {
        if (code === 0) {
          setStatusMessage(`${label} completed successfully`);
        } else {
          setStatusMessage(`${label} exited with code ${code}`);
        }
        childProcessRef.current = null;
        setScreen('output');
      });
    }

    child.on('error', (error) => {
      setCommandOutput(`Error: ${error.message}`);
      childProcessRef.current = null;
      setScreen('output');
    });
  };

  const mainMenuItems = [
    { label: 'Run Dev Server', value: 'dev' },
    { label: 'Build for Production', value: 'build' },
    { label: 'Preview Production Build', value: 'preview' },
    { label: 'Change CV Template', value: 'change' },
    { label: 'Exit', value: 'exit' }
  ];

  const handleMainMenu = (item: { label: string; value: string }) => {
    switch (item.value) {
      case 'dev':
        runCommand('npm', ['run', 'dev'], 'Dev Server', true);
        break;
      case 'build':
        runCommand('npm', ['run', 'build'], 'Production Build', false);
        break;
      case 'preview':
        runCommand('npm', ['run', 'preview'], 'Preview Server', true);
        break;
      case 'change':
        setCvFiles(loadCvFiles());
        setScreen('select-cv');
        setStatusMessage('');
        break;
      case 'exit':
        process.exit(0);
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ╔═══════════════════════════════╗
        </Text>
      </Box>
      <Box>
        <Text bold color="cyan">
          ║       CV Builder CLI          ║
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ╚═══════════════════════════════╝
        </Text>
      </Box>

      {statusMessage && (
        <Box marginBottom={1}>
          <Text color="green">→ {statusMessage}</Text>
        </Box>
      )}

      {screen === 'select-cv' && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text bold>Select a CV template:</Text>
          </Box>
          {cvFiles.length > 0 ? (
            <SelectInput items={cvFiles} onSelect={handleCvSelect} />
          ) : (
            <Text color="yellow">No CV templates found in data/</Text>
          )}
        </Box>
      )}

      {screen === 'main-menu' && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text>
              Current CV: <Text bold color="blue">{selectedCv}</Text>
            </Text>
          </Box>
          <Box marginBottom={1}>
            <Text bold>What would you like to do?</Text>
          </Box>
          <SelectInput items={mainMenuItems} onSelect={handleMainMenu} />
        </Box>
      )}

      {screen === 'running' && (
        <Box>
          <Text color="green">
            <Spinner type="dots" />
          </Text>
          <Text> {runningProcess}...</Text>
        </Box>
      )}

      {screen === 'output' && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text bold>{runningProcess} Output:</Text>
          </Box>
          <Box marginBottom={1} flexDirection="column">
            {commandOutput.split('\n').slice(-15).map((line, i) => (
              <Text key={i} color={line.includes('http') ? 'cyan' : undefined}>
                {line}
              </Text>
            ))}
          </Box>
          <Box marginTop={1}>
            <Text color="gray">Press Enter or Space to return to menu</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}

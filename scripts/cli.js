#!/usr/bin/env node
// cli.js
import { program } from 'commander';
import pugsharp from '../main.js';

program
    .action(() => {
        pugsharp().catch(console.error);
    });

program.parse(process.argv);

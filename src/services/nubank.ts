import { NubankApi } from 'nubank-api'; // ES Modules syntax

import { v4 as uuidv4 } from 'uuid'; // Browser/Node.js

import { createInterface } from 'readline';
import { writeFile } from 'fs/promises';

const CPF = '';
const PASSWORD = '';
const AUTH_CODE: string = uuidv4();

const api = new NubankApi();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  `Generate a QRcode and read with the app: ${AUTH_CODE}`,
  async () => {
    try {
      await api.auth.authenticateWithQrCode(CPF, PASSWORD, AUTH_CODE);
      console.log('You are authenticated!');
      console.log(api.authState);
      await writeFile('./auth-state.json', JSON.stringify(api.authState)); // Saves the auth data to use later
      process.exit(0);
    } catch (e) {
      console.error(e.stack);
    }
  },
);

export { api };

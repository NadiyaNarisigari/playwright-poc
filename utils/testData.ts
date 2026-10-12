import { randomInt } from 'crypto';

const ID_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const MIN_ID_LENGTH = 6;

// e.g. "AutoTest-Customer-1791283378971"
export function uniqueName(prefix: string): string {
  return `${prefix}${Date.now()}`;
}

// Prefix + random letters/digits, maxLength characters in total, e.g. "Automation_Test_Factory_K7Q2ZD"
export function shortUniqueName(prefix: string, maxLength: number): string {
  const idLength = maxLength - prefix.length;
  if (idLength < MIN_ID_LENGTH) {
    throw new Error(`Prefix "${prefix}" leaves fewer than ${MIN_ID_LENGTH} characters for the unique part.`);
  }

  let id = '';
  for (let i = 0; i < idLength; i++) {
    id += ID_CHARACTERS[randomInt(ID_CHARACTERS.length)];
  }
  return `${prefix}${id}`;
}
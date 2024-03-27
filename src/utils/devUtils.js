import fs from 'fs/promises';
import path from 'path';

// Separate asynchronous function to write data to files
async function writeDataToFile(data, fileName) {
  return;
  try {
    const filePath = path.join(process.cwd(), 'data', fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data saved to ${fileName}`);
  } catch (error) {
    console.error(`Error saving data to ${fileName}:`, error);
  }
}

export { writeDataToFile };

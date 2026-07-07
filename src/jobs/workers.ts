import 'dotenv/config'
import { startWorker } from './queue';

async function main() {
  console.log("Starting job worker...");
  await startWorker();
}

main();
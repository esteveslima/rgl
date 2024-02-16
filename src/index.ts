import { httpServer } from './server';

async function main() {
  try {
    await httpServer.listen();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

function shutdown(event: string) {
  return async () => {
    try {
      console.log(`${event} received`);
      await httpServer.close();
    } catch (err) {
      console.error('Error while shutting down: ', err);
    }

    process.exit(1);
  };
}

main();

process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT', shutdown('SIGINT'))
  .on('uncaughtException', shutdown('uncaughtException'));

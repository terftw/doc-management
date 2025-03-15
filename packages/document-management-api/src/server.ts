import app from './app';
import prisma from './shared/db/prisma';

// Environment variables
const PORT = process.env.PORT || 8000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Document Management API running on http://localhost:${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...');

  server.close(async () => {
    console.log('HTTP server closed');

    // Clean up database connections
    await prisma.$disconnect();
    console.log('Database connections closed');

    process.exit(0);
  });

  // Force close after timeout
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  shutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown();
});

export default server;

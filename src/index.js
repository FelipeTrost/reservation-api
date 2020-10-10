const app = require('./app');

const port = process.env.PORT || 5000;

// Start the server when database ready
app.on('databaseReady', () => {
  app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
  });
});

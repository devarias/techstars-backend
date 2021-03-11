const app = require('./app');

const port = process.env.PORT || 5000;
async function main() {
  await app.listen(port, () => console.log(`Server listening in port ${port}`));
}
main();

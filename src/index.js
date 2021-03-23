const app = require('./app');
const { setTasks } = require('./mail/send_mail');

const port = process.env.PORT || 5000;
async function main() {
  await app.listen(port, () => console.log(`Server listening in port ${port}`));
  setTasks();
}
main();

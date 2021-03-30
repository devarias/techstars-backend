const app = require('./app');
const { sendMails } = require('./mail/send_mails');

const port = process.env.PORT || 5000;
function main() {
  app.listen(port, () => console.log(`Server listening in port ${port}`));
  sendMails();
}
main();

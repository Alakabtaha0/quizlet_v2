const nodemailer =  require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'alakabtaha@gmail.com',
        pass: 'mrrt mldh jzhg qjep'
    }
});

module.exports = transporter;
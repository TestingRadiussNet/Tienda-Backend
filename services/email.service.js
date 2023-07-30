import nodemailer from "nodemailer";

/**nodemailer config */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pruebas.radiussnet@gmail.com',
        pass: 'emjmhxdbmlppqjsx',
    }
});

export const EnviarCorreoPorUsuario = (from, subject, html) => {
    const mailOptions = {
        from,
        to: 'pruebas.radiussnet@gmail.com',
        subject,
        html,
    }
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                console.log('Correo electrónico enviado a ' + mailOptions.to);
                resolve(info.response);
            }
        });
    });
}

export const EnviarCorreo = (to, subject, html) => {
    const mailOptions = {
        from: 'pruebas.radiussnet@gmail.com',
        to,
        subject,
        html,
    }
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                console.log('Correo electrónico enviado a ' + mailOptions.to);
                resolve(info.response);
            }
        });
    });
}
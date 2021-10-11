"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordChangedSuccessfulMail = exports.sendVerifiedEmailSuccessMail = exports.sendRPMail = exports.sendWelcomeMail = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_sendgrid_1 = __importDefault(require("nodemailer-sendgrid"));
const options = {
    apiKey: process.env.SENDGRID_API_KEY,
};
const SENDER = `Everest Hello <${process.env.SENDGRID_SINGLE_SENDER}>`;
const transport = nodemailer_1.default.createTransport(nodemailer_sendgrid_1.default(options));
const sendMail = (to, subject, html) => {
    return transport.sendMail({
        to: to,
        subject: subject,
        from: SENDER,
        html: html,
    }, (error, info) => {
        if (error)
            console.log("Mail : Error");
        else
            console.log("Mail : Success");
    });
};
exports.sendMail = sendMail;
const sendWelcomeMail = (user, verificationLink) => {
    const subject = "Welcome to Everest";
    const html = `
  <center>
        <h4>Hey ${user.userName}, Welcome to Everest.</h4>
        <p>Click the link below to verify your account</p>
        <a href="${verificationLink}">Verify Account</a>
  </center>

    `;
    return exports.sendMail(user.email, subject, html);
};
exports.sendWelcomeMail = sendWelcomeMail;
const sendRPMail = (user, link) => {
    const subject = "Reset Password";
    const html = `
          <h2>Hey ${user.userName}, you have requested to reset password. Click the link below to reset password</h2>
            <a href='${link}' _target='blank'>Reset Password</a>
          `;
    return exports.sendMail(user.email, subject, html);
};
exports.sendRPMail = sendRPMail;
const sendVerifiedEmailSuccessMail = (user, signInUrl) => {
    const subject = "Email Verification Done";
    const html = `
  <center>
        <h4>Hey ${user.userName}, Congratulations.</h4>
        <p>You have successfully verified your email. </p>
        <a href="${signInUrl}">SignIn Now</a>
  </center>

    `;
    return exports.sendMail(user.email, subject, html);
};
exports.sendVerifiedEmailSuccessMail = sendVerifiedEmailSuccessMail;
const sendPasswordChangedSuccessfulMail = (user, signInUrl) => {
    const subject = "Password Changed Successfully";
    const html = `
  <center>
        <h4>Hey ${user.userName}, Congratulations.</h4>
        <p>You have successfully changed your password. Please sign in.</p>
        <a href="${signInUrl}">SignIn Now</a>
  </center>

    `;
    return exports.sendMail(user.email, subject, html);
};
exports.sendPasswordChangedSuccessfulMail = sendPasswordChangedSuccessfulMail;

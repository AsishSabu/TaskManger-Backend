"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpEmail = void 0;
const otpEmail = (otp, name) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 70%;
          margin: 50px auto;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .logo {
          font-size: 1.4em;
          color: #00466a;
          text-decoration: none;
          font-weight: 600;
        }
        .otp-container {
          background: #00466a;
          color: #fff;
          margin: 20px auto;
          width: max-content;
          padding: 10px;
          border-radius: 4px;
        }
        .footer {
          float: right;
          padding: 8px 0;
          color: #aaa;
          font-size: 0.8em;
          line-height: 1;
          font-weight: 300;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div>
          <a href="#" class="logo">Task Manager</a>
        </div>
        <p>Hi,${name}</p>
        <p>Welcome to TaskManager. Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 minutes</p>
        <div class="otp-container">${otp}</div>
        <p>Regards,<br />BedBliss</p>
        <div class="footer">
          <p>BedBliss</p>
          <p>Kochi, Ernakulam, Kerala</p>
          <p>India</p>
        </div>
      </div>
    </body>
    </html>
    `;
};
exports.otpEmail = otpEmail;

const generateEmailTemplate = (resetLink: string) => {
    return (
        `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Password Reset</title>

            <meta name="color-scheme" content="light dark">
            <meta name="supported-color-schemes" content="light dark">

            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

            <style>
                body {
                margin: 0;
                padding: 0;
                background-color: #f4f6f8;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
                            Roboto, Helvetica, Arial, sans-serif;
                color: #333333;
                }
                .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }
                .header {
                background-color: #1f6feb;
                padding: 24px;
                text-align: center;
                color: #ffffff;
                font-weight: 600;
                letter-spacing: 0.2px;
                }
                .content {
                padding: 32px;
                line-height: 1.6;
                }
                .content h1 {
                font-size: 22px;
                margin-bottom: 16px;
                color: #111111;
                font-weight: 600;
                }
                .content p {
                margin: 0 0 16px;
                font-size: 15px;
                font-weight: 400;
                }
                .button-wrapper {
                text-align: center;
                margin: 32px 0;
                }
                .reset-button {
                display: inline-block;
                padding: 14px 28px;
                background-color: #1f6feb;
                color: #ffffff !important;
                text-decoration: none;
                font-size: 15px;
                border-radius: 6px;
                font-weight: 600;
                }
                .footer {
                background-color: #f4f6f8;
                padding: 20px;
                text-align: center;
                font-size: 13px;
                color: #666666;
                font-weight: 400;
                }
                .footer a {
                color: #1f6feb;
                text-decoration: none;
                font-weight: 500;
                }

                @media (prefers-color-scheme: dark) {
                body {
                    background-color: #0f1115;
                    color: #e6e6e6;
                }
                .container {
                    background-color: #161b22;
                    box-shadow: none;
                }
                .content h1 {
                    color: #ffffff;
                }
                .content p {
                    color: #d0d7de;
                }
                .footer {
                    background-color: #0f1115;
                    color: #9da7b3;
                }
                .footer a {
                    color: #58a6ff;
                }
                }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                Kibos
                </div>

                <div class="content">
                <h1>Password Reset Request</h1>
                <p>
                    We received a request to reset the password for your Kibos account.
                    Click the button below to create a new password.
                </p>

                <div class="button-wrapper">
                    <a href="${resetLink}" class="reset-button">
                    Reset Password
                    </a>
                </div>

                <p>
                    This link will expire in a limited time for security reasons. If you did
                    not request a password reset, please ignore this email or contact our
                    support team.
                </p>

                <p>
                    Thank you,<br />
                    The Kibos Team
                </p>
                </div>

                <div class="footer">
                <p>
                    © 2026 Kibos. All rights reserved.<br />
                </p>
                </div>
            </div>
            </body>
            </html>
        `
    );
}

export default generateEmailTemplate;
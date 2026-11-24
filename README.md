# Gaming Hub — Installation and User Guide

Gaming Hub is an online digital game store featuring a customer area and an administrative panel. This document provides instructions on how to run the project and test its main features.

## 1. Requirements

Before getting started, make sure you have installed the following programs:

- **JDK 25:** required to run the backend.
- **Node.js 24.15 or newer within the 24.x series:** required to run the frontend.

After installing the required programs, extract the complete project ZIP file into a folder on your computer.

## 2. How to Run Gaming Hub

The project consists of two parts that must run simultaneously: the backend, responsible for processing information, and the frontend, which displays the store interface.

### First Terminal — Start the Backend

Open PowerShell in the main project folder and run:

```powershell
cd backend
.\mvnw\.cmd spring-boot:run
```

Wait until Spring Boot finishes starting. During the first execution, the process may take a little longer because Maven needs to download the required dependencies.

### Configure the Administrator

Before starting the backend, you must configure the administrator's email and password.

Run the following commands in the same terminal:

```powershell
$env:ADMIN_EMAIL = Read-Host "Administrator email"
$env:ADMIN_PASSWORD = [System.Net.NetworkCredential]::new('', (Read-Host "Administrator password" -AsSecureString)).Password
```

Enter the credentials agreed upon by your team.

**Important:** These credentials must be configured again whenever a new PowerShell session is opened.

### Second Terminal — Start the Store

Open another PowerShell window in the main project folder and run:

```powershell
cd ecommerceP1
npm.cmd ci
npm.cmd start
```

The first command installs the required dependencies. The project will then start.

Once everything is running, access the store at:

http://localhost:4200

The backend will be available at:

http://localhost:8080

## 3. How to Use the Customer Area

The store allows users to create their own accounts, make purchases, and manage their personal information.

### Create an Account

1. Open the store.
2. Click **Sign Up**.
3. Enter your name, email, an example CPF with 11 digits, and password.
4. After registration, the system automatically logs you in.

Use fictional information during testing.

### My Account

After logging in, click the **My Account** icon.

In this section, customers can:

- View their account information.
- Update their name and email.
- Change their password using their current password.
- Delete their own account.

### Change Password

To test password changes, open My Account, enter your current password, and set a new one.

Then, log out and try logging in again using the new password.

### Forgot Password

If a customer forgets their password, they can use the **Forgot Password** option.

For this demonstration project, the password recovery process sets a fixed temporary password: `Senha1234`.

No email is sent during this process. After recovering access, the customer can use the temporary password to log in.

### Log Out

Use the logout option to end your current session.

## 4. How the Administrative Area Works

Unlike customers, administrators cannot create accounts through the public store registration page.

Administrative access is controlled by the backend, which recognizes the administrator using the email and password configured earlier.

After logging in with the administrator credentials:

- The system identifies the user as an administrator.
- Access to the administrative panel is granted.
- The administrator can manage the games available in the store.

Regular customers are not authorized to access these administrative features.

## 5. Account Security

Gaming Hub uses a session-based authentication system to identify logged-in users.

After login, the browser receives a session identifier. This identifier is sent with subsequent requests so the backend can recognize the authenticated user.

This helps protect personal information and control access to system features.

For example, a customer can view and update their own information but cannot modify another customer's account.

## 6. Important Notes

- Use fictional accounts when testing the application.
- To test account operations, use the same browser where you originally logged in.
- When using Postman, make sure to preserve the session cookie.
- Administrator credentials must be configured before starting the backend.
- The password recovery feature uses a fixed temporary password and is intended for demonstration purposes only.

## 7. Conclusion

Gaming Hub provides the main features of an online game store, allowing customers to create and manage their accounts while administrators have exclusive access to game management features.

The project was developed with a separation between frontend and backend, allowing the user interface and information processing to work together.

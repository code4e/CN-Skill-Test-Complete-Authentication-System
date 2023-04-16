# CN-Skill-Test-Complete-Authentication-System
# A complete authentication system which can be used as a starter code for creating any new application

1) After downloading/ pulling the git repo, run "npm i" to install all the necessary dependencies\
2) At the root level of the project, create a .env file and the secret keys and passwords to it which is going to be used for jwt encryption/decryption, social auth, mailers\
        e.g. Inside the .env file: - SECRET_KEY=<your_secret_key>\
3) Below are the features
    3.1) A Login/ Sign Up page with manual login using jwt and cookies. 
    3.2) A Social Login feature using google OUATH to authenticate the user.
    3.3) A forgot password feature which redirects the user to enter their email id and sends a one time link to reset password.

4) A home page on which the user lands after logging in. The page has a header with Change Password and Logout Buttons.

5) The logged in routes are protected. 

6) A change password button that redirects you to a page where you can enter the new password.

7) Forgot password - Putting your email id in the forgot password form sends a request to the backend which generates a one time token link using the old password and sends it to the email id using nodemailer provided with an expiry of 15min. (This is user configurable). Clicking on this link takes you to a page to enter the new password.

8) All the notifications and flash messages are handeled using connect-flash and noty.js

9) In the manual authentication, when a user logs in, the request gets routed through a login middleware which does the authentication and using passport-jwt-strategy. After generating a jwt token, the createSession method sets it inside the cookies to send it back to the user. Now, with every subsequent request, the user sends back that jwt token from the cookies and it gets verified and decrypted during each request and autheticates the user using passport.authenticate middleware.

10) Note: - to start the project, you would need to set up a .env file in the root folder and set up the follwing keys for them to be used inside the project: - 
                PASSWORD_RESET_SECRET="<password reset secret>"
                TOKEN_SECRET="<token secret>"
                SESSION_SECRET="<session secret>"
                TRANSPORTER_EMAIL="<transporter email>"
                TRANSPORTER_PASSWORD="<transporter password>"
                GOOGLE_CLIENT_ID="<google client id>"
                GOOGLE_CLIENT_SECRET="<google client secret>"

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

6) 

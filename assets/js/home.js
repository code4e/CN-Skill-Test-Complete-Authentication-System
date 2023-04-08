(function () {

    let signBtn = document.querySelector('.img__btn');
    signBtn.addEventListener('click', function () {
        document.querySelector('.cont').classList.toggle('s--signup');
    });

    //store the context of noty and bind it to use later while showing notifications
    let noty = $.getScript.bind(null, "/js/notifications.js");


    function signUp() {
        let signUpForm = $(".sign-up");

        signUpForm.submit(event => {
            event.preventDefault();

            //check if password and confirm password match or not
            if ($("#sign-up-password").val() !== $("#confirm-password").val()) {
                //show noty that password do not match
                console.log('Password do not match');
                return;
            } else {
                //make ajax request for sign up form submission
                $.ajax({
                    type: "POST",
                    url: "/users/create",
                    data: signUpForm.serialize(),// serializes the form data i.e. converts the form data into json
                    success: data => {
                        //take the user to sign in
                        signBtn.click();
                        //show noty for sucessfull user creation
                        noty(() => showSucessNotification(data.message));
                    },
                    //show failure notification
                    error: error => noty(() => showErrorNotification(JSON.parse(error.responseText).message)),
                });
            }
        })
    }

    signUp();
})();



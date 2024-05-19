
var last_icon = null;

function SignIn(username, passcode)
{
    API.GetUser(username).then(user => {
        if(user != null && user.passcode == btoa(btoa(btoa(passcode))))
        {
            LocalStorage.SetCurrentAccount(user);
            window.open('../home/index.html', '_self');
        }else{
            alert('Invalid username or passcode.')
        }
    })
}

window.addEventListener('load', function () {
    SetBackgroundScroll(0.25);

    Array.from($("input")).forEach(button => {
        button.addEventListener('click', function () {
            this.setAttribute("style", "");
        })
    })

    const fileSelector = document.getElementById('create_icon');
    fileSelector.addEventListener('change', (event) => {
      const fileList = event.target.files;
      last_icon = fileList;
    });
})

function CreateAccount()
{
    $("#create_button").text("Loading...");

    const username = $("#create_username").val();
    const icon = $("#create_icon").val();
    const passcode = $("#create_passcode").val();
    const confirm_passcode = $("#create_confirm_passcode").val();

    if(username.length < 4)
    {
        FailCreate('Your username is too short. (Minimum 4 characters)', "#create_username");
        return;
    }

    if(passcode !== confirm_passcode)
    {
        FailCreate('Your confirmation passcode and passcode did not match!', "#create_passcode", "#create_confirm_passcode");
        return;
    }

    if(passcode.length < 8)
    {
        FailCreate("Your password is too short. (Minimum 8 characters)", "#create_passcode");
        return;
    }

    API.GetAllUsers().then(users => {
        for(var i = 0; i < users.length; i++)
        {
            if(users[i].username === username)
            {
                FailCreate('That username already exists.', "#create_username");
                return;
            }
        }
        
        if(last_icon != null && last_icon != undefined)
        {
            if(last_icon[0].size > 500)
            {
                FailCreate('Your user icon is to large. (minimum 32x32 pixels)', "#create_icon")
                return;
            }
            
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                FinishCreate(username, passcode, event.target.result);
                return;
            });
            reader.readAsDataURL(last_icon[0]);
        }else{
            FinishCreate(username, passcode, null);
            return;
        }

    })

   // alert('Failed to connect to server.')
  //  $("#create_button").text("Create Account");
}

function FinishCreate(username, passcode, icon)
{
    API.UpdateUser({ username: username, passcode: btoa(btoa(btoa(passcode))), icon: btoa(icon) }).then(d => {
        SignIn(username, passcode);
    })
}

function FailCreate(message)
{
    for(var el = 1; el < arguments.length; el++)
    {
        $(arguments[el]).attr("style", "background-color: #663300;").val("");
    }

    alert(message);
    $("#create_button").text("Create Account");
    $("#create_confirm_passcode").val("");
}

function getMetadataForFileList(fileList) {
    for (const file of fileList) {
      const name = file.name ? file.name : 'NOT SUPPORTED';
      const type = file.type ? file.type : 'NOT SUPPORTED';
      const size = file.size ? file.size : 'NOT SUPPORTED';
      console.log({file, name, type, size});
    }
  }
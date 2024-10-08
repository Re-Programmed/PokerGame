
var last_icon = null;function SignIn(username, passcode)
{
    rc_0x01623.rc_0x01623_gu(username).then(user => {
        if(user != null && user.passcode == btoa(btoa(btoa(passcode))))
        {
            ls_0x15.ls_0x15_sca(user);            window.open('../home/index.html', '_self');        }else{
            alert('Invalid username or passcode.')
        }
    })
}

window.addEventListener('load', function () {
    SetBackgroundScroll(0.25);    Array.from($("input")).forEach(button => {
        button.addEventListener('click', function () {
            this.setAttribute("style", "");        })
    })

    const fileSelector = document.getElementById('create_icon');    fileSelector.addEventListener('change', (event) => {
      const fileList = event.target.files;      last_icon = fileList;    });})

function CreateAccount()
{
    $("#create_button").text("Loading...");    const username = $("#create_username").val();    const icon = $("#create_icon").val();    const passcode = $("#create_passcode").val();    const confirm_passcode = $("#create_confirm_passcode").val();    if(username.length < 4)
    {
        FailCreate('Your username is too short. (Minimum 4 characters)', "#create_username");        return;    }

    if(passcode !== confirm_passcode)
    {
        FailCreate('Your confirmation passcode and passcode did not match!', "#create_passcode", "#create_confirm_passcode");        return;    }

    if(passcode.length < 8)
    {
        FailCreate("Your password is too short. (Minimum 8 characters)", "#create_passcode");        return;    }

    rc_0x01623.rc_0x01623_gau().then(users => {
        for(var i = 0; i < users.length; i++)
        {
            if(users[i].username === username)
            {
                FailCreate('That username already exists.', "#create_username");                return;            }
        }
        
        if(last_icon != null && last_icon != undefined)
        {
            console.log(last_icon[0].size);            if(last_icon[0].size > 2000)
            {
                FailCreate('Your user icon is to large. (maximum 2000)', "#create_icon")
                return;            }
            
            const reader = new FileReader();            reader.addEventListener('load', (event) => {
                FinishCreate(username, passcode, event.target.result);                return;            });            reader.readAsDataURL(last_icon[0]);        }else{
            FinishCreate(username, passcode, null);            return;        }

    })

}
function FinishCreate(username, passcode, icon)
{
    rc_0x01623.rc_0x01623_uu({ username: username, passcode: btoa(btoa(btoa(passcode))), icon: btoa(icon), chips: 0, money: 5000, cpoints: 0, customize: {BGColor: "default", NameColor: "default", Font: "default", Border: "default", Set: [-1], Pack: [-1], Theme: "default"}, c_unlock: [], c_owned: [], stats: {wins: 0}, l_board: "", ll_check:0 } ).then(d => {
        SignIn(username, passcode);    })
}
function FailCreate(message)
{
    for(var el = 1; el < arguments.length; el++)
    {
        $(arguments[el]).attr("style", "background-color: #663300;").val("");    }

    alert(message);    $("#create_button").text("Create Account");    $("#create_confirm_passcode").val("");}

function getMetadataForFileList(fileList) {
    for (const file of fileList) {
      const name = file.name ? file.name : 'NOT SUPPORTED';      const type = file.type ? file.type : 'NOT SUPPORTED';      const size = file.size ? file.size : 'NOT SUPPORTED';      console.log({file, name, type, size});    }
  }
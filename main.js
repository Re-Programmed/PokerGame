var scrollFunc = () => {}, scrollPos = 0;

function LoadSwipe(mult)
{
    var pos = 102.5*(mult < 0 ? 1 : -1);
    document.body.setAttribute("style", `transform: translate(${pos}%, 0);background-position-x: 9px; background-position-y: 0px;`);

    SwipePage(mult, pos);
}

window.addEventListener('load', function () {
    this.setInterval(function () {
        scrollFunc();
    }, 10)

    document.getElementById('sign_in_button').addEventListener('click', function (){
        if(this.hasAttribute('enabled')){return;}

        SwipePage(1);
        setTimeout(function () {
            window.open('../signin/index.html?invalid=true', '_self')
        }, 220)
    })

    document.getElementById('acc_button').addEventListener('click', function (){
        if(this.hasAttribute('enabled')){return;}

        SwipePage(-1);
        setTimeout(function () {
            window.open('../home/index.html', '_self')
        }, 220)
    })

    document.getElementById('ral_button').addEventListener('click', function (){
        if(this.hasAttribute('enabled')){return;}

        SwipePage(1);
        setTimeout(function () {
            window.open('../rooms_and_leaderboard/index.html', '_self')
        }, 220)
    })
})

function SetBackgroundScroll(speed)
{
    scrollFunc = function () {
        scrollPos += speed;
        document.body.setAttribute("style", `background-position-x: ${scrollPos}px; background-position-y: ${scrollPos/2}px;`);
    }
}

function SwipePage(mult, initpos = 0)
{
    var pos = initpos;
    scrollFunc = function () {};

    for(var x = 0; x < 100; x++)
    {
        setTimeout(function () {
            pos += 1.025 * mult;
            document.body.setAttribute("style", `transform: translate(${pos}%, 0);background-position-x: ${scrollPos}px; background-position-y: ${scrollPos/2}px;`);
        }, x * 2);
    }
}
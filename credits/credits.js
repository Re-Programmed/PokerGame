window.addEventListener('load', function() {
})

//Creates text that scrolls up the screen.
function CreateScrollText(value, color = "#DDDDDD")
{
    const scrollText = document.createElement("div");
    scrollText.style = `
        position: fixed;
        top: 100%;
        left: 50%;
        transform: translate(-50%, 0);
        padding: 7px;
        text-align: center;
    `

    scrollText.innerHTML = `<h1 style="color: ${color};">${value}</h1>`
    
    document.body.appendChild(scrollText);

    const fadeInt = setInterval(function () {
        scrollText.style.top = (scrollText.style.top.replace("%", "") - 0.1) + "%"; 

        if(parseFloat(scrollText.style.top.replace("%", "")) > 50)
        {
            scrollText.style.color = "#DDDDDDFF";
        }else{
            const value = parseInt((100 * ((scrollText.style.top.replace("%", "") + 50)/50)));
            scrollText.style.color = "#DDDDDD" + value;

            if(parseFloat(scrollText.style.top.replace("%", "")) < -50)
            {
                scrollText.remove();
                clearInterval(fadeInt);
            }
        }
    }, 1)
}

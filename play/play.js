window.addEventListener('load', function () {
    LoadSwipe(1);
    
    //SetBackgroundScroll(0.25);

    const table = GetURLParam("table");

    if(table == null)
    {
        this.window.open('../rooms_and_leaderboard/index.html', '_self');
    }

    
})
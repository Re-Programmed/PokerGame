const CENSOR_regex = `^[a@][s\$][s\$]$
[a@][s\$][s\$]h[o0][l1][e3][s\$]?
b[a@][s\$][t\+][a@]rd 
b[e3][a@][s\$][t\+][i1][a@]?[l1]([i1][t\+]y)?
b[e3][a@][s\$][t\+][i1][l1][i1][t\+]y
b[e3][s\$][t\+][i1][a@][l1]([i1][t\+]y)?
b[i1][t\+]ch[s\$]?
b[i1][t\+]ch[e3]r[s\$]?
b[i1][t\+]ch[e3][s\$]
b[i1][t\+]ch[i1]ng?
b[l1][o0]wj[o0]b[s\$]?
c[l1][i1][t\+]
^(c|k|ck|q)[o0](c|k|ck|q)[s\$]?$
(c|k|ck|q)[o0](c|k|ck|q)[s\$]u
(c|k|ck|q)[o0](c|k|ck|q)[s\$]u(c|k|ck|q)[e3]d 
(c|k|ck|q)[o0](c|k|ck|q)[s\$]u(c|k|ck|q)[e3]r
(c|k|ck|q)[o0](c|k|ck|q)[s\$]u(c|k|ck|q)[i1]ng
(c|k|ck|q)[o0](c|k|ck|q)[s\$]u(c|k|ck|q)[s\$]
^cum[s\$]?$
cumm??[e3]r
cumm?[i1]ngcock
(c|k|ck|q)um[s\$]h[o0][t\+]
(c|k|ck|q)un[i1][l1][i1]ngu[s\$]
(c|k|ck|q)un[i1][l1][l1][i1]ngu[s\$]
(c|k|ck|q)unn[i1][l1][i1]ngu[s\$]
(c|k|ck|q)un[t\+][s\$]?
(c|k|ck|q)un[t\+][l1][i1](c|k|ck|q)
(c|k|ck|q)un[t\+][l1][i1](c|k|ck|q)[e3]r
(c|k|ck|q)un[t\+][l1][i1](c|k|ck|q)[i1]ng
cyb[e3]r(ph|f)u(c|k|ck|q)
d[a@]mn
d[i1]ck
d[i1][l1]d[o0]
d[i1][l1]d[o0][s\$]
d[i1]n(c|k|ck|q)
d[i1]n(c|k|ck|q)[s\$]
[e3]j[a@]cu[l1]
(ph|f)[a@]g[s\$]?
(ph|f)[a@]gg[i1]ng
(ph|f)[a@]gg?[o0][t\+][s\$]?
(ph|f)[a@]gg[s\$]
(ph|f)[e3][l1][l1]?[a@][t\+][i1][o0]
(ph|f)u(c|k|ck|q)
(ph|f)u(c|k|ck|q)[s\$]?
g[a@]ngb[a@]ng[s\$]?
g[a@]ngb[a@]ng[e3]d
g[a@]y
h[o0]m?m[o0]
h[o0]rny
j[a@](c|k|ck|q)\-?[o0](ph|f)(ph|f)?
j[e3]rk\-?[o0](ph|f)(ph|f)?
j[i1][s\$z][s\$z]?m?
[ck][o0]ndum[s\$]?
mast(e|ur)b(8|ait|ate)
n+[i1]+[gq]+[e3]*r+[s\$]*
[o0]rg[a@][s\$][i1]m[s\$]?
[o0]rg[a@][s\$]m[s\$]?
p[e3]nn?[i1][s\$]
p[i1][s\$][s\$]
p[i1][s\$][s\$][o0](ph|f)(ph|f) 
p[o0]rn
p[o0]rn[o0][s\$]?
p[o0]rn[o0]gr[a@]phy
pr[i1]ck[s\$]?
pu[s\$][s\$][i1][e3][s\$]
pu[s\$][s\$]y[s\$]?
[s\$][e3]x
[s\$]h[i1][t\+][s\$]?
[s\$][l1]u[t\+][s\$]?
[s\$]mu[t\+][s\$]?
[s\$]punk[s\$]?
[t\+]w[a@][t\+][s\$]?
[n]+[iu1]+[g]+[a]?
[n]+[iu1]+[g]+[u]+[h]?
[n]+[iu1]+[g]+[e]+[r]?
[c]+[h]+[i1]+[n]+[ck]?
[c]+[i1]+[n]+[ck]?
[f]+[a]+[t]+[a]+[s5]+[s5]?`

function censorText(text)
{
    const arr = CENSOR_regex.split("\n");
    for(var i = 0; i < arr.length; i++)
    {
        console.log(arr[i])
        text = text.replace(new RegExp(arr[i]), m => "*");
    }

    return text;
}

const REPORT_SCREEN = `
    <h3>Report</h3>
    <input id="report_player" style="width: 50%;height: 24px; z-index: 5;" placeholder="Player" value="%playerName%" disabled="true"></input>
    <input id="report_reason" style="width: 50%;height: 24px; z-index: 5;" placeholder="Reason" maxlength="20" value="%tempateReason%"></input>
    <textarea id="report_say_more" placeholder="Say more..." style="resize: none;width: 70%;height: 70px;" maxlength="200"></textarea>
    <button onclick="SubmitReport();">Submit Report</button>
`

const randomDefaultReports = [
    "Naughty Boy",
    "Stole My Chips",
    "Committed War Crimes",
    "Laundering Money",
    "Breaking The Law"
]

function FileAReport(templateReason = "")
{
    const parent = document.createElement("div");
    parent.setAttribute("style", "width: 45%; height: 55%; background-color: var(--bg-color);border: 3px solid var(--bg-dark); position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; justify-content: center;align-items:center;z-index:4;")
    parent.id = "report_box";

    parent.innerHTML = REPORT_SCREEN.replace(/%tempateReason%/g, templateReason == "" ? randomDefaultReports[Math.floor(Math.random() * randomDefaultReports.length)] : templateReason).replace(/%playerName%/g, currentUser.username);

    document.body.appendChild(parent);

    setTimeout(() => {
        const reasond = document.getElementById("report_reason");
        const saymored = document.getElementById("report_say_more");

        //Constantly limit text length.
        setInterval(() => {
            reasond.setAttribute("maxlength", "20");
            saymored.setAttribute("maxlength", "200");

            $("#report_player").val(currentUser.username);

            if(reasond.value.length > 20)
            {
                reasond.value = reasond.value.substring(0, 20);
            }

            if(saymored.value.length > 200)
            {
                saymored.value = saymored.value.substring(0, 200);
            }
        }, 5)
    }, 150)
}

function SubmitReport()
{
    const reasond = document.getElementById("report_reason");
    const saymored = document.getElementById("report_say_more");

    //Prevent report spamming.
    if(localStorage.getItem("pokerGAME_provided_reports") != null && JSON.parse(localStorage.getItem("pokerGAME_provided_reports")).includes(currentUser.username))
    {
        alert('You have already reported this player.');
        return;
    }

    if(reasond.value.length < 5)
    {
        alert('Please provide a reason.')
        return;
    }

    if(saymored.value.length < 15)
    {
        alert('Please provide a description of your report.')
        return;
    }

    API.GetItem("content_reports").then(reports => {
        var arr = JSON.parse(atob(reports.data));
        arr.push({r: reasond.value, s: saymored.value, p: currentUser.username});

        var localReports = localStorage.getItem("pokerGAME_provided_reports");
        if(localReports == null)
        {
            localReports = [];
        }else{
            localReports = JSON.parse(localReports);
        }

        localReports.push(currentUser.username);

        localStorage.setItem("pokerGAME_provided_reports", JSON.stringify(localReports));

        API.SendItem("content_reports", btoa(JSON.stringify(arr))).then(d => {
            $("#report_box").html("Thank You!");
            setTimeout(function () {
                $("#report_box").remove();
            }, 1500)
        })

        console.log(arr);
    })
}
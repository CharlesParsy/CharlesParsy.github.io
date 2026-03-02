//Menu
document.getElementById("buttonMenu").addEventListener("click",rouler);


document.getElementById(document.title).style = "border-bottom: solid 3px orange";


function rouler() {
    var x = document.getElementById("main");
    if (x.style.marginTop === "230px") {
        x.style.marginTop = "0";
        document.getElementById("line1").classList.remove("line1");
        document.getElementById("line2").hidden = false;
        document.getElementById("line3").classList.remove("line3");
    } else {
        x.style.marginTop = "230px";
        document.getElementById("line1").classList.add("line1");
        document.getElementById("line2").hidden = true;
        document.getElementById("line3").classList.add("line3");
    }
}
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        } else {
            reveals[i].classList.remove("active");
        }
    }
}

window.addEventListener("scroll", reveal);


document.getElementById("g1").addEventListener("mouseenter", () => {
    document.getElementById("d1").hidden = false;
    document.getElementById("d1").classList.add("anim");
    // document.getElementById("g5").style="margin-top: 30px;";
});
document.getElementById("g1").addEventListener("mouseleave", () => {
    document.getElementById("d1").hidden = true;
    // document.getElementById("g5").style="margin-top: 300px;";
});

document.getElementById("g2").addEventListener("mouseenter", () => {
    document.getElementById("d2").hidden = false;
    document.getElementById("d2").classList.add("anim");
    // document.getElementById("g5").style="margin-top: 30px;";
});
document.getElementById("g2").addEventListener("mouseleave", () => {
    document.getElementById("d2").hidden = true;
    // document.getElementById("g5").style="margin-top: 300px;";
});

document.getElementById("g3").addEventListener("mouseenter", () => {
    document.getElementById("d3").hidden = false;
    document.getElementById("d3").classList.add("anim");
    // document.getElementById("g5").style="margin-top: 30px;";
});
document.getElementById("g3").addEventListener("mouseleave", () => {
    document.getElementById("d3").hidden = true;
    // document.getElementById("g5").style="margin-top: 300px;";
});

document.getElementById("g4").addEventListener("mouseenter", () => {
    document.getElementById("d4").hidden = false;
    document.getElementById("d4").classList.add("anim");
    // document.getElementById("g5").style="margin-top: 30px;";
});
document.getElementById("g4").addEventListener("mouseleave", () => {
    document.getElementById("d4").hidden = true
    // document.getElementById("g5").style="margin-top: 300px;";
});

document.getElementById("g5").addEventListener("mouseenter", () => {
    document.getElementById("d5").hidden = false;
    document.getElementById("d5").classList.add("anim");
});
document.getElementById("g5").addEventListener("mouseleave", () => {
    document.getElementById("d5").hidden = true;
    // document.getElementById("c2").style="padding-top: 220px;";
});

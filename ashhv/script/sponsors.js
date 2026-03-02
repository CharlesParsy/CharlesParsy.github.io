//Sponsors

sponsors = [[18,19,20],[1,16,2],[22,14,4],[5,24,6],[13,3]];
sponsors2 = [[21,23,25],[26,27]];


g = document.getElementById("g");
d = document.getElementById("d");

g.param = [sponsors,g,d];
d.param = [sponsors,g,d];

g.addEventListener("click",gauche);
d.addEventListener("click",droite);

g2 = document.getElementById("g2");
d2= document.getElementById("d2");

g2.param = [sponsors2,g2,d2];
d2.param = [sponsors2,g2,d2];

g2.addEventListener("click",gauche);
d2.addEventListener("click",droite);


function gauche(evt) {
    sps = evt.currentTarget.param[0];
    for(x=sps.length-1;x>0;x--) {
        if(!document.getElementById(sps[x][0]).hidden) {
            for (sp of sps[x]) {
                document.getElementById(sp).hidden = true;
            }
            for (sp of sps[x-1]) {
                document.getElementById(sp).hidden = false;
            }
            evt.currentTarget.param[2].hidden = false;
            if(x===1) {
                evt.currentTarget.param[1].hidden=true;
            }
            return 0;
        }
    }
}

function droite(evt) {
    sps = evt.currentTarget.param[0];
    for(x=0;x<sps.length;x++) {
        if(!document.getElementById(sps[x][0]).hidden) {
            for (sp of sps[x]) {
                document.getElementById(sp).hidden=true;
            }
            for (sp of sps[x+1]) {
                document.getElementById(sp).hidden=false;
            }
            if(x===0) {
                evt.currentTarget.param[1].hidden = false;
            }
            if(x===sps.length-2) {
                evt.currentTarget.param[2].hidden=true;
            }
            return 0;
        }
    }
}
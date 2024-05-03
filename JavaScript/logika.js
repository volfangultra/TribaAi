var player1_color_light = '#2D4263';
var player1_color = 'blue';
var player2_color_light = '#C84B31';
var player2_color = 'red';
var player1_of_color = '#00003f';
var player2_of_color = '#3f0000';
var player1 = "PLAYER";
var player2 = "AI";
const base_color = 'rgba(236,219,186,0.6)';
const epsilon = 0.00001;


var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var matrica_krugova = [];
var trenutno_izabrani = [];
var nacrtani_trokuti = [];
var prekrizeni_krugovi = [];
var igra_prvi = true;
var prvi_ai = false;
var boja_jaka = player1_color;
var boja_slaba = player1_color_light;
var base_of_color = player1_of_color;
var width;
var height;
var jacina_ai;
var broj_svih_moguich_poteza;
var brojac_simulacija = 0;
var pobjedio_nas = 0;
var pobjedio_protivnik = 0;
var brojac_errora = 0;


document.getElementById("ponovo_igrat").addEventListener("click", function(){
    event.preventDefault();
    const imena = document.getElementById("menu");
    imena.style.display = "none";
    resetuj_igru();

});



document.getElementById("noob").addEventListener("click", function(){
    event.preventDefault();
    jacina_ai = "NOOB"
    const imena = document.getElementById('imena_igraca');
    imena.style.display = "none";
    promijeni_banner();

});

document.getElementById("amater").addEventListener("click", function(){
    event.preventDefault();
    jacina_ai = "AMATEUR";
    const imena = document.getElementById('imena_igraca');
    imena.style.display = "none";
    promijeni_banner();

});

document.getElementById("pro").addEventListener("click", function(){
    event.preventDefault();
    jacina_ai = "PRO";
    const imena = document.getElementById('imena_igraca');
    imena.style.display = "none";
    promijeni_banner();

});

function igra_ai(){
    
    var ai_trokut;
    if(jacina_ai == "NOOB")
        ai_trokut = igra_noob();
    else if(jacina_ai == "AMATEUR")
        ai_trokut = igra_amateur();
    else if(jacina_ai == "PRO")
        ai_trokut = igra_pro();
    if(ai_trokut == null)
    ai_trokut = igra_noob();

    nacrtani_trokuti.push(ai_trokut);
    prekrizi_krugove(ai_trokut); 
    if(!mogu_napravit_torkut())
        prikazi_pobjedu();
    else{
        igra_prvi = !igra_prvi;
        promijeni_banner();
    }
    
}

function test_ai(jacina_ai, igra_moj){
    if(!mogu_napravit_torkut()){
        if(igra_moj)
            pobjedio_protivnik += 1
        else
            pobjedio_nas += 1

        brojac_simulacija += 1
        if(brojac_simulacija < 300)
            resetuj_igru(true, jacina_ai);
        else
            console.log("MOJ AI: ", pobjedio_nas, "TEST AI: ", pobjedio_protivnik, "ERROR: ", brojac_errora);
        return
    }else {
        var ai_trokut;
        if(igra_moj){
            if(jacina_ai == "NOOB")
                ai_trokut = igra_noob();
            else if(jacina_ai == "AMATEUR")
                ai_trokut = igra_amateur();
            else if(jacina_ai == "PRO")
                ai_trokut = igra_pro();
        }
        else
            ai_trokut = igra_noob();
        
        nacrtani_trokuti.push(ai_trokut);
        prekrizi_krugove(ai_trokut);
    }
    
    test_ai(jacina_ai, !igra_moj)
}

function simuliraj(visina, sirina, jacina_ai){
    player1 = "NOOB TESTER";
    player2 = "AI";
    width = sirina;
    height = visina;
    broj_svih_moguich_poteza = visina * visina * visina * sirina * sirina * sirina
    promijeni_banner();
    let pomak = 1/10 * c.width;
    let r = 40;
    let pb = 50;
    if (visina >= 10)
        r = 30;
    if(visina >= 14){
        r = 20;
        pb = 30;
    }
    let prostor = (c.width - 2*pomak)/sirina;
    let y_kruga = c.height / visina;

    for(let i = 0; i < visina; i++){
        matrica_krugova.push([]);
        for(let j = 0; j < sirina; j++){
            let krug = new Krug(pomak + j*prostor + prostor/2, pb + y_kruga * i, r, base_color);
            matrica_krugova[i].push(krug);
            krug.nacrtaj(ctx);
        }
    }

    if(igra_prvi)
        test_ai(jacina_ai, true);
    else
        test_ai("NOOB", false)
}

function pokreni_igru(visina, sirina){
    width = sirina;
    height = visina;
    broj_svih_moguich_poteza = visina * visina * visina * sirina * sirina * sirina
    promijeni_banner();
    let pomak = 1/10 * c.width;
    let r = 40;
    let pb = 50;
    if (visina >= 10)
        r = 30;
    if(visina >= 14){
        r = 20;
        pb = 30;
    }
    let prostor = (c.width - 2*pomak)/sirina;
    let y_kruga = c.height / visina;

    for(let i = 0; i < visina; i++){
        matrica_krugova.push([]);
        for(let j = 0; j < sirina; j++){
            let krug = new Krug(pomak + j*prostor + prostor/2, pb + y_kruga * i, r, base_color);
            matrica_krugova[i].push(krug);
            krug.nacrtaj(ctx);
        }
    }

    if(prvi_ai && igra_prvi){
        postavi_boje();
        igra_ai()
    }
}


c.onmousemove = function(mis){
    postavi_boje();
    ocisti_canvas();

    koordinate_misa = koordinate(mis);

    document.getElementById('sve').style.cursor = 'default';
    for (let i = 0; i < matrica_krugova.length; i++){ 
        for(let j = 0; j < matrica_krugova[i].length; j++){
            if(matrica_krugova[i][j].nalazi_u(koordinate_misa.x,koordinate_misa.y)){
                matrica_krugova[i][j].update(ctx, boja_slaba);
                document.getElementById('sve').style.cursor = 'pointer';
            }
            else
                matrica_krugova[i][j].update(ctx, base_color);

            if(matrica_krugova[i][j].izabran)
                matrica_krugova[i][j].update(ctx, boja_slaba);
        }
    }

    napravi_trouglove();
    hover_na_mis(koordinate_misa);

}

canvas.addEventListener('click', function(mis) {
    koordinate_misa = koordinate(mis);
    
    
        for (let i = 0; i < matrica_krugova.length; i++)
            for(let j = 0; j < matrica_krugova[i].length; j++) 
                if(matrica_krugova[i][j].nalazi_u(koordinate_misa.x,koordinate_misa.y) && !matrica_krugova[i][j].blokiran){
                    matrica_krugova[i][j].izabran = true;
                    trenutno_izabrani.push(matrica_krugova[i][j]);
                    
                }

        if(trenutno_izabrani.length === 3){
            let trokut = new Trokut(trenutno_izabrani[0].x, trenutno_izabrani[0].y,
                                    trenutno_izabrani[1].x, trenutno_izabrani[1].y,
                                    trenutno_izabrani[2].x, trenutno_izabrani[2].y,
                                    boja_jaka);

            if(provjeri_trokut(trokut) === true){
                nacrtani_trokuti.push(trokut);
                blokiraj_izabrane();
                prekrizi_krugove(trokut);
                if(!mogu_napravit_torkut())
                    prikazi_pobjedu();
                else{
                    igra_prvi = !igra_prvi;
                    postavi_boje();
                    promijeni_banner();
                    igra_ai();
                }
            }

            resetuj_izabrane();
        }
 });
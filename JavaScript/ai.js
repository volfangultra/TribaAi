function sve_moguce_opcije(){
    let moguci_trokutovi = [];
    for(let i1 = 0; i1 < matrica_krugova.length; i1++)
    for(let j1 = 0; j1 < matrica_krugova[i1].length; j1++)
        for(let i2 = i1; i2 < matrica_krugova.length; i2++)
        for(let j2 = 0; j2 < matrica_krugova[i2].length; j2++)
                for(let i3 = i2; i3 < matrica_krugova.length; i3++)
                for(let j3 = 0; j3 < matrica_krugova[i3].length; j3++){
                    if(1000*i1 + j1 < 1000*i2 + j2 && 1000*i2 + j2 < 1000*i3 + j3 && !matrica_krugova[i1][j1].blokiran && !matrica_krugova[i2][j2].blokiran && !matrica_krugova[i3][j3].blokiran){
                        trokut = new Trokut(    matrica_krugova[i1][j1].x, matrica_krugova[i1][j1].y,
                                                matrica_krugova[i2][j2].x, matrica_krugova[i2][j2].y,
                                                matrica_krugova[i3][j3].x, matrica_krugova[i3][j3].y, boja_jaka);
                        if(provjeri_trokut(trokut))
                            moguci_trokutovi.push(trokut)
                        
                    }
                }
    return moguci_trokutovi;
}

function ostali_trokutovi(moguci_trokutovi){
	rez = []
	for(let trokut of moguci_trokutovi)
		if(provjeri_trokut(trokut))
			rez.push(trokut)
	return rez
}

function evaluiraj_board_noob(maksimizira_ai, n){
    if(maksimizira_ai && n == 0)
        return -1
    if(!maksimizira_ai && n == 0)
        return 1
    return 0
}

function evaluiraj_board_pro(maksimizira_ai, n){
    if(maksimizira_ai && n == 0)
        return -1 * broj_svih_moguich_poteza;
    if(!maksimizira_ai && n == 0)
        return 1 * broj_svih_moguich_poteza;
    if(maksimizira_ai)
        return n
    if(!maksimizira_ai)
        return -1 * n
}

function napravi_potez(potez){
    for(let i = 0; i < matrica_krugova.length; i++)
        for(let j = 0; j < matrica_krugova[i].length; j++)
            if(potez.sjece_krug(matrica_krugova[i][j])){
                matrica_krugova[i][j].blokiran = true;
            }
}

function vrati_potez(potez){
    for(let i = 0; i < matrica_krugova.length; i++)
        for(let j = 0; j < matrica_krugova[i].length; j++)
            if(potez.sjece_krug(matrica_krugova[i][j]) || potez.je_vrh(matrica_krugova[i][j].x, matrica_krugova[i][j].y)){
                matrica_krugova[i][j].blokiran = false;
            }
}

function alphaBeta(dubina, alpha, beta, maksimizira_ai, evaluiraj_board, opcije) {
    let moguci_potezi = ostali_trokutovi(opcije);
    if (dubina === 0 || moguci_potezi.length === 0) {
        return [evaluiraj_board(maksimizira_ai, moguci_potezi.length), null];
    }

    let najbolji_potez = null;
    
    if (maksimizira_ai) {
        let snaga_najjaceg_poteza = -Infinity;
        for (let potez of moguci_potezi) {
            

            napravi_potez(potez)

            let snaga_poteza = alphaBeta(dubina - 1, alpha, beta, false, evaluiraj_board, moguci_potezi)[0];
            if (snaga_poteza > snaga_najjaceg_poteza) {
                snaga_najjaceg_poteza = snaga_poteza;
                najbolji_potez = potez;
            }
            alpha = Math.max(alpha, snaga_poteza);

            vrati_potez(potez)

            if (beta <= alpha) {
                break; 
            }
        }
        return [snaga_najjaceg_poteza, najbolji_potez];
    } else {
        let snaga_najjaceg_poteza = Infinity;
        for (let potez of moguci_potezi) {
            napravi_potez(potez)

            let snaga_poteza = alphaBeta(dubina - 1, alpha, beta, true, evaluiraj_board, moguci_potezi)[0];
            if (snaga_poteza < snaga_najjaceg_poteza) {
                snaga_najjaceg_poteza = snaga_poteza;
                najbolji_potez = potez;
            }
            beta = Math.min(beta, snaga_poteza);

            
            vrati_potez(potez)

            if (beta <= alpha) {
                break;
            }
        }
        return [snaga_najjaceg_poteza, najbolji_potez];
    }
}

function igra_noob(){
	opcije = sve_moguce_opcije()
    broj_poteza = opcije.length;
    if(broj_poteza < 100)
        return alphaBeta(1, -Infinity, Infinity, true, evaluiraj_board_noob, opcije)[1];
    
    while(true){
        i1 = Math.floor(Math.random() * matrica_krugova.length);
        j1 = Math.floor(Math.random() * matrica_krugova[i1].length);
        i2 = Math.floor(Math.random() * matrica_krugova.length);
        j2 = Math.floor(Math.random() * matrica_krugova[i2].length);
        i3 = Math.floor(Math.random() * matrica_krugova.length);
        j3 = Math.floor(Math.random() * matrica_krugova[i3].length);
        if(!matrica_krugova[i1][j1].blokiran && !matrica_krugova[i2][j2].blokiran && !matrica_krugova[i3][j3].blokiran){
            trokut = new Trokut(    matrica_krugova[i1][j1].x, matrica_krugova[i1][j1].y,
                                    matrica_krugova[i2][j2].x, matrica_krugova[i2][j2].y,
                                    matrica_krugova[i3][j3].x, matrica_krugova[i3][j3].y,
                                    boja_jaka);

            if(provjeri_trokut(trokut))
                return trokut;
        }
    }
    
}

function igra_amateur(){ 
	opcije = sve_moguce_opcije()
    broj_poteza = opcije.length;

    if(width == 5){
	    if(broj_poteza > 500)
	        return igra_noob();
	    return alphaBeta(100, -Infinity, Infinity, true, evaluiraj_board_noob, opcije)[1];
	}
	if(width == 8){
		if(broj_poteza > 200)
	        return igra_noob();
	    return alphaBeta(100, -Infinity, Infinity, true, evaluiraj_board_noob, opcije)[1];
	}
	if(width == 10){
		if(broj_poteza > 100)
	        return igra_noob();
	    return alphaBeta(100, -Infinity, Infinity, true, evaluiraj_board_noob, opcije)[1];
	}
    
}

function igra_pro(){
    opcije = sve_moguce_opcije()
    
    broj_poteza = opcije.length;
    min_povrsina = Infinity
    najbolji_potez = null
    for(let potez of opcije){
        if(potez.povrsina < min_povrsina && Math.random() > 0.75){
            min_povrsina = potez.povrsina;
            najbolji_potez = potez
        }
    }
    if(najbolji_potez == null)
        najbolji_potez = opcije[0]
    

    if(width == 5){
	    if(broj_poteza > 5000)
	    	return najbolji_potez
	    if(broj_poteza > 1500)
	        return alphaBeta(1, -Infinity, Infinity, true, evaluiraj_board_pro, opcije)[1];
	    if(broj_poteza > 500)
	        return alphaBeta(2, -Infinity, Infinity, true, evaluiraj_board_pro, opcije)[1];
	    return alphaBeta(100, -Infinity, Infinity, true, evaluiraj_board_noob, opcije)[1];
	}
	if(width == 8){
	    if(broj_poteza > 3000)
	    	return najbolji_potez
	    if(broj_poteza > 500)
	        return alphaBeta(1, -Infinity, Infinity, true, evaluiraj_board_pro, opcije)[1];
	    if(broj_poteza > 300)
	        return alphaBeta(2, -Infinity, Infinity, true, evaluiraj_board_pro, opcije)[1];
	    if(broj_poteza > 200)
	    	return alphaBeta(3, -Infinity, Infinity, true, evaluiraj_board_pro, opcije)[1];
	    return alphaBeta(100, -Infinity, Infinity, true, evaluiraj_board_noob, opcije)[1];
	}
	if(width == 10){
	    if(broj_poteza > 2000)
	    	return najbolji_potez
	    if(broj_poteza > 500)
	        return alphaBeta(1, -Infinity, Infinity, true, evaluiraj_board_pro, opcije)[1];
	    if(broj_poteza > 300)
	        return alphaBeta(2, -Infinity, Infinity, true, evaluiraj_board_pro, opcije)[1];
	    if(broj_poteza > 100)
	    	return alphaBeta(3, -Infinity, Infinity, true, evaluiraj_board_pro, opcije)[1];
	    return alphaBeta(100, -Infinity, Infinity, true, evaluiraj_board_noob, opcije)[1];
	}

    return alphaBeta(100, -Infinity, Infinity, true, evaluiraj_board_noob, opcije)[1];

}   
axios.defaults.headers.common['Authorization'] = 'H6IMSun7qTOTnM3FBe41wxJh';


//-----------------------------------------------------------------------------------------
function play_quizz() {
    //esconde a page 1 e mostra a page 2
    document.getElementById('page_1').classList.add('hide');
    document.getElementById('page_2').classList.remove('hide');
}

//-----------------------------------------------------------------------------------------
/*função chamada quando o usuario clica na caixa de perguntas na pagina de criação de perguntas,
serve para fazer ela "abrir" e ser substituida por uma div com novos inputs*/
function toggle_answer(clicked) {

    clicked.setAttribute('onclick', null);
    clicked.classList.remove('container-edits','pointer');

    clicked.innerHTML = `
        <div class="container-inputs">
            <p>${clicked.innerText}</p>
            <input class="inputs-page-3" type="text" placeholder="Texto da pergunta">
            <input class="inputs-page-3" type="text" placeholder="Cor de fundo da pergunta">
            <p>Resposta correta</p>
            <input class="inputs-page-3" type="text" placeholder="Resposta correta">
            <input class="inputs-page-3" type="text" placeholder="URL da imagem">
            <p>Respostas incorretas</p>
            <input class="inputs-page-3" type="text" placeholder="Resposta incorreta 1">
            <input class="inputs-page-3 input_margin" type="text" placeholder="URL da imagem 1">
            <input class="inputs-page-3" type="text" placeholder="Resposta incorreta 2">
            <input class="inputs-page-3 input_margin" type="text" placeholder="URL da imagem 2">
            <input class="inputs-page-3" type="text" placeholder="Resposta incorreta 3">
            <input class="inputs-page-3 input_margin" type="text" placeholder="URL da imagem 3">
        </div>
    `;
}
//-----------------------------------------------------------------------------------------
let ARR_3_1, N, counterSEND;
/*a cada sub página da página 3.1 essa variavel vai mudar, assim alterando qual botão 
será liberado com base nos inputs de cada página, usando a função enable e ENABLE_button*/
let element;
//-----------------------------------------------------------------------------------------
function create_quizz() {

    counterSEND = 3.1;

    //esconde a page 1 e mostra a page 3.1
    document.getElementById('page_1').classList.add('hide');

    //é aqui onde é definido qual página a função enable e ENABLE_button vão levar em consideração
    element = document.getElementById('page_3.1');
    element.classList.remove('hide');
    //chama a função enable a cada 0,1 segundos
    setInterval(enable, 100);

}
//-------------------------
/*precisei fazer a função ENABLE button ser chamada após essa nova porque usar setInterval 
para chamar uma função inserindo um parametro faz ela ser executada somente uma vez*/

/*chama a função ENABLE_button (usando o id do elemento da página ATUAL como parametro)*/
function enable () {
    ENABLE_button(element.id);
}

//-------------------------
//cada botão de cada página altera o valor do counterSEND, e essa função vai executar a função equivalente a ele
function send() {
    if (counterSEND === 3.1) {
        send_3_1();
    } else if (counterSEND === 3.2) {
        send_3_2();
    }
}
//-------------------------
let E_button, FOR_E_button;
//------
//verifica se todos os inputs da page (equivalente ao element.id) estão preenchidos, se sim libera o botão
function ENABLE_button(page) {

    let counter = 0;

    E_button = document.getElementById(page);
    FOR_E_button = E_button.querySelectorAll('.inputs-page-3');

    FOR_E_button.forEach( array => {
        if (array.value !== "") {
            counter += 1;
        }
    });

    const EVENT_E_button = E_button.querySelector('.botão-page-3');

    if  (counter === FOR_E_button.length) {

        E_button.querySelector('.botão-page-3').disabled = false;

        EVENT_E_button.classList.add('pointer');
        EVENT_E_button.addEventListener('click', send);
        
    } else {
        E_button.querySelector('.botão-page-3').disabled = true;
        EVENT_E_button.classList.remove('pointer'); 
    }

}
//----------------------------

function send_3_1() {

    ARR_3_1 = [{
        T_quizz: FOR_E_button[0].value, 
        URL_quizz: FOR_E_button[1].value,
        QTD_P_quizz: FOR_E_button[2].value,
        QTD_N_quizz: FOR_E_button[3].value
    }];

    console.log(ARR_3_1);

    const T = ARR_3_1[0].T_quizz.length; //será usada para o if verificar se a string tem entre 20 e 65 caracteres
    const U = ARR_3_1[0].URL_quizz;
    P = parseInt(ARR_3_1[0].QTD_P_quizz); //será usada para o if verificar se a QTD de P é menor que 3
    N = parseInt(ARR_3_1[0].QTD_N_quizz); //será usada para o if verificar se a QTD de N é menor que 2

    //função para verificar se o objeto é um url de imagem válido
    function isURL(obj) {
        var pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?\.(jpg|jpeg|png|gif)$/i;
        return pattern.test(obj);
    }
    if (T < 20 || T > 65 || isURL(U) === false || isNaN(P) !== false || isNaN(N) !== false || P < 3 || N < 2) {
        alert('O título do Quizz deve ter entre 20 e 65 caracteres\nA URL deve ser válida\nA quantidade de perguntas deve ser maior que 2\nA quantidade de níveis deve ser maior que 1');
    } else {
            
        //apaga os value digitados nos inputs equivalente a página selecionada pelas funções enable e ENABLE_button
        FOR_E_button.forEach( array => {array.value = "";});

        create_quizz_pt2();
    }


}

//----------------------------
function create_quizz_pt2() {

    //renderiza na tela 3.2 divs com perguntas em numero equivalente ao escolhido pelo usuario
    let answer = document.getElementById('answers');
    for (let i = 0; i < P-1; i++) {

        answer.innerHTML += `
            <div onclick="toggle_answer(this)" class="container-edits pointer">
                <p>Pergunta ${i+2}</p>
                <ion-icon class="icone-edit" name="create-outline"></ion-icon>
            </div>
        `;
        
    }

    counterSEND = 3.2;

    document.getElementById('page_3.1').classList.add('hide');
    //element será redefinido para levar a page 3.2 em consideração com as funções enable e ENABLE_button
    element = document.getElementById('page_3.2');
    element.classList.remove('hide');
    //chama a função enable a cada 0,1 segundos
    setInterval(enable, 100);
}
//----

function send_3_2() {
    console.log('aqui');    
}

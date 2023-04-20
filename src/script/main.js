axios.defaults.headers.common['Authorization'] = 'H6IMSun7qTOTnM3FBe41wxJh';

let ARR_3_1, counterSEND;
//---------------------------------------------------------------------------
function create_quizz() {

    counterSEND = 3.1;

    //esconde a page 1 e mostra a page 3.1
    document.getElementById('page_1').classList.add('hide');

    element = document.getElementById('page_3.1');
    element.classList.remove('hide');
    //chama a função ENABLE_button a cada 0,1 segundos (usando o id do elemento como parametro)
    setInterval(ENABLE_button(element.id), 100);

}
//------
function play_quizz() {
    //esconde a page 1 e mostra a page 2
    document.getElementById('page_1').classList.add('hide');
    document.getElementById('page_2').classList.remove('hide');
}
//-------------------------------------
let E_button, FOR_E_button;

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
//cada botão de cada página altera o valor do counterSEND, e essa função vai executar a equivalente a ele
function send() {
    if (counterSEND === 3.1) {
        send_3_1();
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
    const P = parseInt(ARR_3_1[0].QTD_P_quizz); //será usada para o if verificar se a QTD de P é menor que 3
    const N = parseInt(ARR_3_1[0].QTD_N_quizz); //será usada para o if verificar se a QTD de N é menor que 2

    //função para verificar se o objeto é um url de imagem válido
    function isURL(obj) {
        var pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?\.(jpg|jpeg|png|gif)$/i;
        return pattern.test(obj);
    }

    if (T < 20 || T > 65 || isURL(U) === false || P < 3 || N < 2) {
        alert('O título do Quizz deve ter entre 20 e 65 caracteres\nA URL deve ser válida\nA quantidade de perguntas deve ser maior que 2\nA quantidade de níveis deve ser maior que 1')
    } else {
        //apaga os value digitados nos inputs
        FOR_E_button.forEach( array => {array.value = "";});

        document.getElementById('page_3.1').classList.add('hide');
        document.getElementById('page_3.2').classList.remove('hide');
    }
}

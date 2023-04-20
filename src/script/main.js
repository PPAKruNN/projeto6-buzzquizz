axios.defaults.headers.common['Authorization'] = 'H6IMSun7qTOTnM3FBe41wxJh';

//---------------------------------------------------------------------------
function create_quizz() {

    //esconde a page 1 e mostra a page 3.1
    document.getElementById('page_1').classList.add('hide');
    document.getElementById('page_3.1').classList.remove('hide');
    //chama a função button_3_1 a cada 0,1 segundos
    setInterval(FUNCbutton_3_1, 100);

}
//------
function play_quizz() {
    //esconde a page 1 e mostra a page 2
    document.getElementById('page_1').classList.add('hide');
    document.getElementById('page_2').classList.remove('hide');
}
//------
let ARR_3_1, button_3_1, FORbutton_3_1;
//verifica se todos os inputs da page 3.1 estão preenchidos, se sim libera o botão
function FUNCbutton_3_1() {

    let counter = 0;

    button_3_1 = document.getElementById('page_3.1');
    FORbutton_3_1 = button_3_1.querySelectorAll('.inputs-page-3');

    FORbutton_3_1.forEach( array => {
        if (array.value !== "") {
            counter += 1;
        }
    });

    const EVENTbutton_3_1 = button_3_1.querySelector('.botão-page-3');

    if  (counter === FORbutton_3_1.length) {

        button_3_1.querySelector('.botão-page-3').disabled = false;

        EVENTbutton_3_1.classList.add('pointer');
        EVENTbutton_3_1.addEventListener('click', send_3_1);
        
    } else {
        button_3_1.querySelector('.botão-page-3').disabled = true;
        EVENTbutton_3_1.classList.remove('pointer'); 
    }

}
function send_3_1() {

    ARR_3_1 = [{
        T_quizz: FORbutton_3_1[0].value, 
        URL_quizz: FORbutton_3_1[1].value,
        QTD_P_quizz: FORbutton_3_1[2].value,
        QTD_N_quizz: FORbutton_3_1[3].value
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
        FORbutton_3_1.forEach( array => {array.value = "";});

        document.getElementById('page_3.1').classList.add('hide');
        document.getElementById('page_3.2').classList.remove('hide');
    }
}

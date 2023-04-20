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
        EVENTbutton_3_1.classList.remove('pointer');   
    }

}
function send_3_1() {

    ARR_3_1 = [
        {T_quizz: FORbutton_3_1[0].value},
        {URL_quizz: FORbutton_3_1[1].value},
        {QTD_P_quizz: FORbutton_3_1[2].value},
        {QTD_N_quizz: FORbutton_3_1[2].value}
    ];
    console.log(ARR_3_1);
    console.log(parseInt(ARR_3_1[0].QTD_P_quizz));

    let length = ARR_3_1[0].T_quizz.length; //será usada para o if verificar se a string tem entre 20 e 65 caracteres

    //apaga os value digitados nos inputs
    FORbutton_3_1.forEach( array => {array.value = "";});

    document.getElementById('page_3.1').classList.add('hide');
    document.getElementById('page_3.2').classList.remove('hide');
}

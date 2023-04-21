axios.defaults.headers.common['Authorization'] = 'H6IMSun7qTOTnM3FBe41wxJh';

const endpoints = 
{
    "quizzes": 'https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes',
}

let runtime_data = {
    currentQuizId: undefined,
    currentQuizAnswers: []
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function play_quizz(quizz_id) {

    if(!quizz_id)
    {
        quizz_id = 59; // no momento estou usando assim só pra conseguir desenvolver o básico.
        // {pokemon: 59, pele: 65}
        
    }
    runtime_data.currentQuizId = quizz_id 
    
    document.getElementById('page_1').classList.add('hide');
    document.getElementById('page_3.4').classList.add('hide');
    document.getElementById('page_2').classList.remove('hide');
    document.getElementById('page_3.4').classList.add('hide');
    
    const res = await getQuizInfo(quizz_id);
    console.log(res.data);

    updateQuizInfo(res.data);
    
}

function voltarParaHome() 
{
    document.getElementById('page_2').classList.add('hide');
    document.getElementById('page_3.4').classList.add('hide');
    document.getElementById('page_1').classList.remove('hide');

    eraseQuiz();
    runtime_data.currentQuizId = undefined;
    runtime_data.currentQuizAnswers = [];

    buscarQuizzes();
}

function getQuizInfo(quizz_id)
{
    const promisse = axios.get(endpoints.quizzes + "/" + quizz_id);
    promisse.catch( (error) => {
        console.error("UM ERRO OCORREU AO TENTAR BUSCAR INFORMAÇÕES NO SERVIDOR: " + error.data);
    });

    return promisse;
}

function updateQuizInfo(data) {
    const quizz_title = document.querySelector(".quizz_title");
    quizz_title.innerHTML = data.title;
    // ADICIONAR FORMA DE MUDAR BACKGROUND do header!

    shuffleArray(data.questions);
    
    eraseQuiz();

    for (let i = 0; i < data.questions.length; i++) {
        const question = data.questions[i];
        
        const answerData = renderQuizQuestion(question, i);
        runtime_data.currentQuizAnswers[answerData.id] = answerData.correctAnswer;
    }

}


function renderQuizQuestion(questionData, INTERN_ID) {
    let options_tags = "";
    let correctAnswer;    
    
    // FALTA ADICIONAR COR PERSONALIZADA DE ACORDO COM O JSON PARA CADA QUESTAO.

    shuffleArray(questionData.answers);

    questionData.answers.forEach( (answer) => {
        if(answer.isCorrectAnswer) correctAnswer = answer.text;
        
        options_tags += `
        <div class="options" onclick="selectOption(this)">
            <img src="${answer.image}"/>
            <p class="text_options">${answer.text}</p>
        </div>
        `
    });

    document.querySelector(".questions-container").innerHTML += `
    <div class="question_box" data-id="${INTERN_ID}">
        <div class="content-question_box">
            
            <div class="question" style="background-color: ${questionData.color}">
                <p class="text_question">${questionData.title}</p>
            </div>
    
            <div class="images_box">
                ${options_tags}
            </div>
        </div>
    </div>
    `
    
    return {
        correctAnswer,
        id: INTERN_ID,
    }
}

function eraseQuiz() {
    document.querySelector(".questions-container").innerHTML = "";
}

function redefineQuizz() {
    play_quizz(runtime_data.currentQuizId);
    document.querySelector(".quizz_header").scrollIntoView();
}

//---------------------------------------------------------------------------------------------

function selectOption(el) {
    const questionbox = el.parentElement.parentElement.parentElement;
    let questionId =  questionbox.dataset.id
    let selectedText = el.innerText;

    let isCorrectAnswer = selectedText == runtime_data.currentQuizAnswers[questionId];

    console.log("A resposta está correta?:" + isCorrectAnswer);

    questionVisualEmphasis(selectedText, questionId)
}



function evaluateQuestion(isCorrect, questionId) {
    
}

function questionVisualEmphasis(selectedOptionText, questionId)
{
    questionOptions = document.querySelectorAll(`[data-id="${questionId}"] .options`);

    questionOptions.forEach( (option) => {
        if(option.innerText == runtime_data.currentQuizAnswers[questionId])
        {
            option.children[1].classList.add("correctAnswer")
        } else {
            option.children[1].classList.add("wrongAnswer")
        }

        if( !(selectedOptionText == option.innerText) )
        {
            option.classList.add("reduceOptionOpacity")
        }

        // remove on click
        option.onclick = "";
    });

}


function shuffleArray(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
} 

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
let listaDeQuizzesDoUsuario = [];
function buscarQuizzesDoUsuario(){
    let listaDeQuizzesDoUsuarioSalvass = localStorage.getItem("ids");
    let listaDeQuizzesDoUsuarioSalvas = JSON.parse(listaDeQuizzesDoUsuarioSalvass); //Uma array com todos os objetos com os ids
    if (listaDeQuizzesDoUsuarioSalvas === null){
        const containerDosQuizzesDoUsuario = document.querySelector('.container_column');
        containerDosQuizzesDoUsuario.classList.add('hide');
        const containerDeCriacaoDequizz = document.querySelector('.create_quizz');
        containerDeCriacaoDequizz.classList.remove('hide');
    }else{
        for(i=0; i<listaDeQuizzesDoUsuarioSalvas.length; i++){
            listaDeQuizzesDoUsuario.push(listaDeQuizzesDoUsuarioSalvas[i]);
        }
    }
    console.log(listaDeQuizzesDoUsuario); //Uma array com todos os objetos com os ids
}
buscarQuizzesDoUsuario();

function saveQuizzInLocalstorage(idQuizz){//Essa função roda apenas quando clica no botão de finalizar quizz que roda outra função que chama essa
    const objetoQuizz = {
            id: `${idQuizz}`
        }
    listaDeQuizzesDoUsuario.push(objetoQuizz);
    const listaDeQuizzesDoUsuarioSerializada = JSON.stringify(listaDeQuizzesDoUsuario);
    localStorage.setItem("ids", listaDeQuizzesDoUsuarioSerializada);
}
//localStorage.removeItem("ids");

function QuizzesDoUsuario(quizz){
    console.log(quizz.id);
    for(i=0; i<listaDeQuizzesDoUsuario.length; i++){
        console.log(listaDeQuizzesDoUsuario[i].id)
        if (quizz.id == listaDeQuizzesDoUsuario[i].id){
            return true;
        }
    }
}
function QuizzesQueNaoSaoDoUsuario(quizz){
    if (listaDeQuizzesDoUsuario.length === 0){
        return true;
    }else{
        for(i=0; i<listaDeQuizzesDoUsuario.length; i++){
            console.log(listaDeQuizzesDoUsuario[i].id)
            if (quizz.id !== listaDeQuizzesDoUsuario[i].id){
                return true;
            }
        }
    }
}

//Para renderizar os quizzes do usuraio analisar os ids da listaDeQuizzes e os ids da listaDeQuizzesDoUsuario
function renderizarUserQuizzes(listaDeQuizzes){
    const listaDeQuizzesfiltradasParaOUsuario = listaDeQuizzes.filter(QuizzesDoUsuario);
    console.log(listaDeQuizzesfiltradasParaOUsuario);
    const userQuizzesContainer = document.querySelector('.your.quizzes');
    userQuizzesContainer.innerHTML = '';
    for(let i = 0; i < listaDeQuizzesfiltradasParaOUsuario.length; i++){
        userQuizzesContainer.innerHTML += `
            <div class="container-quizz pointer" data-id = "${listaDeQuizzesfiltradasParaOUsuario[i].id}" onclick="play_quizz()">
                <div class="quizz-transparency"></div>
                <img class="quizz-img"src="${listaDeQuizzesfiltradasParaOUsuario[i].image}"/>
                <div class="edit-and-delet-quizz">
                        <ion-icon class="icones" name="create-outline"></ion-icon>
                        <ion-icon class="icones" name="trash-outline"></ion-icon>
                </div>
                <p class="text_quizz">${listaDeQuizzesfiltradasParaOUsuario[i].title}</p>  
            </div>`
    }
}

function renderizarQuizzes(listaDeQuizzes){
    console.log(listaDeQuizzes);
    const listaDeQuizzesGeral = listaDeQuizzes.filter(QuizzesQueNaoSaoDoUsuario);
    console.log(listaDeQuizzesGeral);
    const quizzesContainer = document.querySelector('.all.quizzes');
    quizzesContainer.innerHTML = '';
    for(let i = 0; i < listaDeQuizzesGeral.length; i++){
        quizzesContainer.innerHTML += `
        <div class="container-quizz pointer" data-id = "${listaDeQuizzesGeral[i].id}" onclick="play_quizz()">
            <div class="quizz-transparency"></div>
            <img class="quizz-img"src="${listaDeQuizzesGeral[i].image}"/>
            <p class="text_quizz">${listaDeQuizzesGeral[i].title}</p>  
        </div>`
    }
}

function buscarQuizzes(){
    const promiseQuizzes = axios.get(endpoints.quizzes);
    promiseQuizzes.then((quizzesBuscados) => {
        renderizarQuizzes(quizzesBuscados.data);
        renderizarUserQuizzes(quizzesBuscados.data);
    })
    promiseQuizzes.catch(erroNaBuscaDosQuizzes => {
        console.log('Não foi possível conectar com o servidor');
    })
}
buscarQuizzes();
setInterval(buscarQuizzes, 5000);
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function home_after_create() {

    document.getElementById('page_1').classList.remove('hide');
    document.getElementById('page_3.4').classList.add('hide');

    buscarQuizzes();
}
//------------------------------------------------------------------------------
let answer_counter = 0; //para contar se tem alguma pergunta não criada
/*função chamada quando o usuario clica na caixa de pergunta na pagina de criação de perguntas,
serve para fazer ela "abrir" e ser substituida por uma div com novos inputs*/
function toggle_answer(clicked) {

    answer_counter++

    clicked.setAttribute('onclick', null);
    clicked.classList.remove('container-edits','pointer');

    clicked.innerHTML = `
        <div id ="${clicked.innerText.replace(/(\s|e|r|g|u|n|t|a)/g, "")}" class="container-inputs"> 
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
//------------------------------------------------------------------------------
let level_counter = 0; //para contar se tem algum nível não criado
/*função chamada quando o usuario clica na caixa de nível na pagina de criação de perguntas,
serve para fazer ela "abrir" e ser substituida por uma div com novos inputs*/
function toggle_level(clicked) {

    level_counter++;

    clicked.setAttribute('onclick', null);
    clicked.classList.remove('container-edits', 'pointer');
    
    clicked.innerHTML = `
        <div id ="${clicked.innerText.replace(/(\s|í|v|e|l)/g, "")}" class="container-inputs">
            <p>${clicked.innerText}</p>
            <input class="inputs-page-3" type="text" placeholder="Título do nível">
            <input class="inputs-page-3" type="text" placeholder="% de acerto mínima">
            <input class="inputs-page-3" type="text" placeholder="URL da imagem do nível">
            <input class="inputs-page-3" type="text" placeholder="Descrição do nível">
        </div>
    `;
}
//------------------------------------------------------------------------------
let created_quizz = {};
//--------------------------------------
let ARR_3_1, ARR_3_2, N, P, U, T, ARR_3_3, counterSEND;
/*a cada sub página da página 3.1 o conteudo da variavel element vai mudar, assim alterando qual botão 
será liberado com base nos inputs de cada página, usando a função enable e ENABLE_button*/
let element;
let error_3_3;
//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------
//cada botão de cada página altera o valor do counterSEND, e essa função vai executar a função equivalente a ele
function send() {
    if (counterSEND === 3.1) {

        send_3_1();

    } else if (counterSEND === 3.2) {

        //vai entrar somente caso todas as perguntas tenham sido clicadas: função toggle_answer(clicked)
        if (answer_counter === P-1) {
            send_3_2();
        } else {
            alert('É necessário criar todas as suas perguntas');
        }

    } else if (counterSEND === 3.3) {

        //vai entrar somente caso todas os níveis tenham sido clicados: função toggle_level(clicked)
        if (level_counter === N-1) {
            send_3_3();
        } else {
            alert('É necessário criar todos os seus níveis');
        }

    } else if (counterSEND === 3.4) {

        const await_promise = axios.post(endpoints.quizzes, created_quizz);
        await_promise.catch(error => {alert(`Ocorreu algum erro, perdão, tente novamente mais tarde\n\n${error.message}`);});
        await_promise.then( sucess => {

            document.getElementById('page_3.4_loading').classList.add('hide');
            document.getElementById('page_3.4').classList.remove('hide');

            //faço um push do id do quizz que acabou de ser criado pra dentro da array da gisele
            listaDeQuizzesDoUsuario.push(sucess.data.id);

            //salvei o id do quizz criado e visualizado na variavel do pedro, para ser usada na função play_quizz do botão da tela 3.4
            runtime_data.currentQuizId = sucess.data.id;

            //o id atual é sendo usado como parametro na função da gisele
            saveQuizzInLocalstorage(sucess.data.id);
            //a função para mostrar os quizzes do usuario esta sendo chamada aqui também após criar o quizz
            buscarQuizzesDoUsuario();

            your_quizz = document.querySelector('.quizz-finalizado');
            your_quizz.innerHTML = `
                <div class="your-container-quizz pointer" onclick="play_quizz()">
                    <div class="your-quizz-transparency"></div>
                    <img class="your-quizz-img"src="${U}"/>
                    <p class="your-text_quizz">${T}</p>  
                </div>
            `;
        });
    }
}
//------------------------
/*precisei fazer a função ENABLE button ser chamada após essa nova porque usar setInterval 
para chamar uma função inserindo um parametro faz ela ser executada somente uma vez*/

/*chama a função ENABLE_button (usando o id do elemento da página ATUAL como parametro)*/
function enable () {
    ENABLE_button(element.id);
}

//------------------------
let E_button, FOR_E_button;
//----
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
//----------------------------------------------------------
//função para verificar se o objeto é um url de imagem válido
function isURL(obj) {
    var pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?\.(jpg|jpeg|png|gif)$/i;
    return pattern.test(obj);
}
//função para verificar se o objeto é uma cor hexadecimal valida
function isHexColor(obj) {
    var hexRegex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    return hexRegex.test(obj);
}
//-----------------------------------------------------------
function send_3_1() {

    ARR_3_1 = [{
        T_quizz: FOR_E_button[0].value, 
        URL_quizz: FOR_E_button[1].value,
        QTD_P_quizz: FOR_E_button[2].value,
        QTD_N_quizz: FOR_E_button[3].value
    }];

    T = ARR_3_1[0].T_quizz; 
    U = ARR_3_1[0].URL_quizz;
    P = parseInt(ARR_3_1[0].QTD_P_quizz);
    N = parseInt(ARR_3_1[0].QTD_N_quizz);

    if (T.length < 20 || T.length > 65 || isURL(U) === false || isNaN(P) !== false || isNaN(N) !== false || P < 3 || N < 2) {
        alert('O título do Quizz deve ter entre 20 e 65 caracteres\nA URL deve ser válida\nA quantidade de perguntas deve ser maior que 2\nA quantidade de níveis deve ser maior que 1');
    } else {
            
        //apaga os value digitados nos inputs equivalente a página selecionada pelas funções enable e ENABLE_button
        FOR_E_button.forEach( array => {array.value = "";});

//------------------------        
        counterSEND = 3.2;

        document.getElementById('page_3.1').classList.add('hide');
        //element será redefinido para levar a page 3.2 em consideração com as funções enable e ENABLE_button
        element = document.getElementById('page_3.2');
        element.classList.remove('hide');
        //chama a função enable a cada 0,1 segundos
        setInterval(enable, 100);
    
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
    }
//-----------------
    created_quizz =

        {
            title: T,
            image: U,

            questions: [],

            levels: []
        }
}
//----------------------------------------------------------
function send_3_2() {

    ARR_3_2 = {obj_perguntas: []};
    let TEMP_array = [];

    //a função toggle_answer(clicked) renderiza caixas de pergunta com ids que vão de 2 até o numero que o jogador escolher. A primeira por padrão tem o id 1
    for (let i = 1; i <= P; i++) {

        //guarda na constante pergunta toda a div com id = i, que começa em 1 e vai até P, numero de perguntas que o jogador escolheu
        const pergunta = document.getElementById(`P${i}`);
        //guarda na constante FOR_pergunta todos uns inputs que estão na div de id = i;
        const FOR_pergunta = pergunta.querySelectorAll('.inputs-page-3');
        //guarda num array temporario o .value (digitado) de todos esses inputs;
        FOR_pergunta.forEach( array => {TEMP_array.push(array.value);});
        //guarda esse array temporario num objeto
        ARR_3_2.obj_perguntas.push(TEMP_array);
        //zera o array temporario para que o ciclo recomece na proxima iteração até que i seja igual a P
        TEMP_array = [];

    }
    
    for (let i = 0; i < P; i++) {

        let text_P = ARR_3_2.obj_perguntas[i][0];
        let color_P = ARR_3_2.obj_perguntas[i][1];
        let right_P = ARR_3_2.obj_perguntas[i][2];
        let right_P_img = ARR_3_2.obj_perguntas[i][3];
        let wrong_P1 = ARR_3_2.obj_perguntas[i][4];
        let wrong_P1_img = ARR_3_2.obj_perguntas[i][5];
        let wrong_P2 = ARR_3_2.obj_perguntas[i][6];
        let wrong_P2_img = ARR_3_2.obj_perguntas[i][7];
        let wrong_P3 = ARR_3_2.obj_perguntas[i][8];
        let wrong_P3_img = ARR_3_2.obj_perguntas[i][9];
//-------------
        created_quizz.questions.push (
            {
                title: text_P,
                color: color_P,
                answers: [
                    {
                        text: right_P,
                        image: right_P_img,
                        isCorrectAnswer: true
                    },
                    {
                        text: wrong_P1,
                        image: wrong_P1_img,
                        isCorrectAnswer: false
                    },
                    {
                        text: wrong_P2,
                        image: wrong_P2_img,
                        isCorrectAnswer: false
                    },
                    {
                        text: wrong_P3,
                        image: wrong_P3_img,
                        isCorrectAnswer: false
                    }

                ]
            }
        );
    }

        //reseta o contador da função toggle_answer(clicked)
        answer_counter = 0;
        //apaga os value digitados nos inputs equivalente a página selecionada pelas funções enable e ENABLE_button
        FOR_E_button.forEach( array => {array.value = "";});

//------------------------ 
        counterSEND = 3.3;

        document.getElementById('page_3.2').classList.add('hide');
        //element será redefinido para levar a page 3.3 em consideração com as funções enable e ENABLE_button
        element = document.getElementById('page_3.3');
        element.classList.remove('hide');
        //chama a função enable a cada 0,1 segundos
        setInterval(enable, 100);

        //renderiza na tela 3.2 divs com perguntas em numero equivalente ao escolhido pelo usuario
        const level = document.getElementById('levels');
        for (let i = 0; i < N-1; i++) {
            
            level.innerHTML += `
                <div onclick="toggle_level(this)" class="container-edits pointer">
                    <p>Nível ${i+2}</p>
                    <ion-icon class="icone-edit" name="create-outline"></ion-icon>
                </div>
            `;
        }
}
//----------------------------------------------------------
function send_3_3 () {

    ARR_3_3 = {obj_niveis: []};
    let TEMP_array = [];

    //a função toggle_answer(clicked) renderiza caixas de pergunta com ids que vão de 2 até o numero que o jogador escolher. A primeira por padrão tem o id 1
    for (let i = 1; i <= N; i++) {

        //guarda na constante nivel toda a div com id = i, que começa em 1 e vai até N, numero de níveis que o jogador escolheu
        const nivel = document.getElementById(`N${i}`);
        //guarda na constante FOR_nivel todos uns inputs que estão na div de id = i;
        const FOR_nivel = nivel.querySelectorAll('.inputs-page-3');
        //guarda num array temporario o .value (digitado) de todos esses inputs;
        FOR_nivel.forEach( array => {TEMP_array.push(array.value);});
        //guarda esse array temporario num objeto
        ARR_3_3.obj_niveis.push(TEMP_array);
        //zera o array temporario para que o ciclo recomece na proxima iteração até que i seja igual a N
        TEMP_array = [];

    }

    for(let i = 0; i < N; i++) {

        let text_N = ARR_3_3.obj_niveis[i][0];
        let min_N = parseInt(ARR_3_3.obj_niveis[i][1]);
        let url_N = ARR_3_3.obj_niveis[i][2];
        let desc_N = ARR_3_3.obj_niveis[i][3];

        created_quizz.levels.push (

            {
                title: text_N,
                image: url_N,
                text: desc_N,
                minValue: min_N 
            }
        );

        const some_zero = created_quizz.levels.some( obj => obj.minValue === 0);

        if (some_zero === false || text_N.length < 10 || min_N < 0 || min_N > 100 || isURL(url_N) === false || desc_N.length < 30) {

            error_3_3 = true;

        } else {

            error_3_3 = false
    
        }
    }
    
    if (error_3_3 === false) {

        console.log(created_quizz);
        
        //reseta o contador da função toggle_level(clicked)
        level_counter = 0;
        //apaga os value digitados nos inputs equivalente a página selecionada pelas funções enable e ENABLE_button
        FOR_E_button.forEach( array => {array.value = "";});
    //------------------------ 
    
        counterSEND = 3.4;

        document.getElementById('page_3.3').classList.add('hide');
        document.getElementById('page_3.4_loading').classList.remove('hide');

        send();

    } else {

        alert('error');

    }
}



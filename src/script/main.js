axios.defaults.headers.common['Authorization'] = 'H6IMSun7qTOTnM3FBe41wxJh';

const endpoints = 
{
    "quizzes": 'https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes',
}

window.scrollTo(0, 0);
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//PEDRO-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
let runtime_data = {
    currentQuizId: undefined,
    currentQuizAnswers: [],
    currentQuizLevels: [],
    currentQuizProgress: {
        totalQuestionsNumber: undefined,
        answeredQuestions: undefined,
        gotRightQuestions: undefined,
    }
}
//-----------------------------------
async function play_quizz(quizz_id) {

    clearInterval(stop_buscarQuizzes);

    runtime_data.currentQuizId = undefined;
    runtime_data.currentQuizAnswers = [];
    runtime_data.currentQuizLevels = [];
    runtime_data.currentQuizProgress.gotRightQuestions = 0;
    runtime_data.currentQuizProgress.answeredQuestions = 0;

    console.log(quizz_id);
    runtime_data.currentQuizId = quizz_id 
    
    document.getElementById('page_reloading').classList.remove('hide');
    document.getElementById('page_1').classList.add('hide');
    document.getElementById('page_3.4').classList.add('hide');
    
    const res = await getQuizInfo(quizz_id);
    document.querySelector(".quizz_header").style.backgroundImage = `url("${res.data.image}")`;

    updateQuizInfo(res.data);
    
}

function voltarParaHome() 
{
    stop_buscarQuizzes = setInterval(buscarQuizzes, 5000);

    document.getElementById('page_2').classList.add('hide');
    document.getElementById('page_1').classList.remove('hide');

    eraseQuiz();

    buscarQuizzes();

    window.scrollTo(0, 0);
}

function getQuizInfo(quizz_id)
{
    const promisse = axios.get(endpoints.quizzes + "/" + quizz_id);
    promisse
    promisse.then( () => {
        document.getElementById('page_reloading').classList.add('hide');
        document.getElementById('page_2').classList.remove('hide');
    });
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

    runtime_data.currentQuizProgress.totalQuestionsNumber = data.questions.length;
    runtime_data.currentQuizLevels = data.levels;

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
        <div data-test="answer" class="options pointer_options" onclick="selectOption(this)">
            <img class="pointer_options_img" src="${answer.image}"/>
            <p data-test="answer-text" class="text_options">${answer.text}</p>
        </div>
        `
    });

    document.querySelector(".questions-container").innerHTML += `
    <div data-test="question" class="question_box" data-idd="${INTERN_ID}">
        <div class="content_question_box">
            
            <div class="question" style="background-color: ${questionData.color}">
                <p data-test="question-title" class="text_question">${questionData.title}</p>
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
    window.scrollTo(0, 0);
}

//---------------------------------------------------------------------------------------------

function selectOption(el) {
    const questionbox = el.parentElement.parentElement.parentElement;
    let questionId =  questionbox.dataset.idd
    let selectedText = el.innerText;

    let isCorrectAnswer = selectedText == runtime_data.currentQuizAnswers[questionId];

    console.log("A resposta está correta?:" + isCorrectAnswer);

    questionVisualEmphasis(selectedText, questionId);
    evaluateQuestion(isCorrectAnswer, questionId);

    if(runtime_data.currentQuizProgress.answeredQuestions == runtime_data.currentQuizProgress.totalQuestionsNumber)
    {
        finishQuiz()
    }
}

function finishQuiz()
{
    const rightPercentage = Math.round( 100 * runtime_data.currentQuizProgress.gotRightQuestions / runtime_data.currentQuizProgress.totalQuestionsNumber); 
    for (let i = runtime_data.currentQuizLevels.length - 1; i >= 0; i--) {
        const level = runtime_data.currentQuizLevels[i];
        console.log(i);
        console.log(rightPercentage, level.minValue)
        
        if(rightPercentage >= Number(level.minValue) )
        {
            // use o level.

            document.querySelector(".questions-container").innerHTML += `
            <div class="question_box RESULT_BOX" ">
                <div class="content_question_box">
                    
                    <div class="question result_question">
                        <p data-test="level-title"class="text_question">${rightPercentage}% de acerto: ${level.title}</p>
                    </div>
            
                    <div class="quizzResult">
                        <img data-test="level-img" src="${level.image}">

                        <p data-test="level-text" class="text-quiz-result">${level.text}</p>
                    </div>
                </div>
            </div>
            `

            setTimeout( () => {
                const el = document.querySelector(".RESULT_BOX");
                el.scrollIntoView({behavior: "smooth", block: "center"})
            }, 2000)

            break;
        }
    }
}

function evaluateQuestion(isCorrect, questionId) {
    if(isCorrect) runtime_data.currentQuizProgress.gotRightQuestions++;
    
    runtime_data.currentQuizProgress.answeredQuestions++;
    
    setTimeout( () => {
        const nextQuestion = document.querySelector(`[data-idd="${Number(questionId) + 1}"]`)
        if(nextQuestion)
        {
            nextQuestion.scrollIntoView({behavior: "smooth", block: "center"});
        }
    }, 2000)

}

function questionVisualEmphasis(selectedOptionText, questionId)
{
    questionOptions = document.querySelectorAll(`[data-idd="${questionId}"] .options`);

    questionOptions.forEach( (option) => {
        if(option.innerText == runtime_data.currentQuizAnswers[questionId])
        {
            option.children[1].classList.add("correctAnswer");
        } else {
            option.children[1].classList.add("wrongAnswer");
        }

        if( !(selectedOptionText == option.innerText) )
        {
            option.classList.add("reduceOptionOpacity");
        }

        option.classList.remove('pointer_options');
        option.children[0].classList.remove('pointer_options_img');

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

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//GISELE-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
let listaDeQuizzesDoUsuario = [];
let listaDeQuizzesfiltradasParaOUsuario = '';
function excluirQuizz(){
    const idpopUp = document.querySelector('.pop-up .id-do-quizz');
    const idDoQuizzQueVaiSerExcluido = idpopUp.innerHTML;
    console.log(idpopUp);
    console.log(idpopUp.innerHTML);
    const divPopUp = idpopUp.parentNode;
    const objQuizzSelecionado = listaDeQuizzesDoUsuario.filter(quizz =>{
        if (quizz.id == idDoQuizzQueVaiSerExcluido){
            return true;
        }
    })
    console.log(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${objQuizzSelecionado[0].id}`);
    console.log(`{headers: {'Secret-Key': ${objQuizzSelecionado[0].key}}}`)
    const promiseDelete = axios.delete(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${objQuizzSelecionado[0].id}`, {headers: {'Secret-Key': `${objQuizzSelecionado[0].key}`}});
    promiseDelete.then(respostaDelecao => {
        console.log(respostaDelecao);
        const divPopUp = idpopUp.parentNode;
        document.getElementById('page_1').classList.add('hide');
        document.getElementById('page_reloading').classList.remove('hide');
        divPopUp.classList.add('hide');
        buscarQuizzes();
        buscarQuizzesDoUsuario();

        window.scrollTo(0, 0);
    })
    promiseDelete.catch(erroDelecao => {
        console.log(erroDelecao);
    })
}
function cancelarexclusao(){
    window.location.reload();
}
function confirmarEnxclusao(idDoQuizz){
    const popUp = document.querySelector('.pop-up');
    popUp.innerHTML += `<div class="id-do-quizz hide">${idDoQuizz}</div>`;
    popUp.classList.remove('hide');
    console.log(popUp);
    console.log(popUp.innerHTML);
    console.log(idDoQuizz);
}
function buscarQuizzesDoUsuario(){
    let listaDeQuizzesDoUsuarioSalvass = localStorage.getItem("ids");
    let listaDeQuizzesDoUsuarioSalvas = JSON.parse(listaDeQuizzesDoUsuarioSalvass); //Uma array com todos os objetos com os ids
    if (listaDeQuizzesDoUsuarioSalvas === null){
        listaDeQuizzesDoUsuario = [];
    }else{
        for(i=0; i<listaDeQuizzesDoUsuarioSalvas.length; i++){
            listaDeQuizzesDoUsuario.push(listaDeQuizzesDoUsuarioSalvas[i]);
        }
    }
    console.log(listaDeQuizzesDoUsuario); //Uma array com todos os objetos com os ids
}


function saveQuizzInLocalstorage(idQuizz, keyQuizz){//Essa função roda apenas quando clica no botão de finalizar quizz que roda outra função que chama essa
    const objetoQuizz = {
            id: Number(`${idQuizz}`),
            key: `${keyQuizz}`
        };
    listaDeQuizzesDoUsuario.push(objetoQuizz);
    const listaDeQuizzesDoUsuarioSerializada = JSON.stringify(listaDeQuizzesDoUsuario);
    localStorage.setItem("ids", listaDeQuizzesDoUsuarioSerializada);
}

//saveQuizzInLocalstorage(318, "9e04034e-6728-469f-9d1f-f6d7e7a0e53c");
//localStorage.removeItem("ids");

function quizzesDoUsuario(quizz){
    for(i=0; i<listaDeQuizzesDoUsuario.length; i++){
        if (quizz.id == listaDeQuizzesDoUsuario[i].id){
            return true;
        }
    }
}
function quizzesQueNaoSaoDoUsuario(quizz){
    let resposta = 0;
    if (listaDeQuizzesDoUsuario.length == 0){
        return true;
    }else{
    for(i=0; i<listaDeQuizzesDoUsuario.length; i++){
        if (quizz.id == listaDeQuizzesDoUsuario[i].id){
            resposta += 0;
        }else{
            resposta += 1;
        }
    }
    }
    if(resposta === listaDeQuizzesDoUsuario.length){
        return true;
    }else{
        return false;
    }
}

const containerDosQuizzesDoUsuario = document.querySelector('.container_column');
const containerDeCriacaoDequizz = document.querySelector('.create_quizz');

function renderizarUserQuizzes(listaDeQuizzes){
    listaDeQuizzesfiltradasParaOUsuario = listaDeQuizzes.filter(quizzesDoUsuario);
    console.log(listaDeQuizzesfiltradasParaOUsuario);
    if(listaDeQuizzesfiltradasParaOUsuario.length === 0){
        containerDosQuizzesDoUsuario.classList.add('hide');
        containerDeCriacaoDequizz.classList.remove('hide');
    } else {
        containerDosQuizzesDoUsuario.classList.remove('hide');
        containerDeCriacaoDequizz.classList.add('hide');
    }
    const userQuizzesContainer = document.querySelector('.your.quizzes');
    userQuizzesContainer.innerHTML = '';
    for(let i = 0; i < listaDeQuizzesfiltradasParaOUsuario.length; i++){
        userQuizzesContainer.innerHTML += `
            <div data-test="my-quiz" class="container-quizz pointer">
                <div class="quizz-transparency"></div>
                <img class="quizz-img"src="${listaDeQuizzesfiltradasParaOUsuario[i].image}"/>
                <div class="ativacao-do-quizz" data-id = "${listaDeQuizzesfiltradasParaOUsuario[i].id}" onclick="play_quizz(this.dataset.id)"></div>
                <div class="ativacao-do-quizz-lateral" data-id = "${listaDeQuizzesfiltradasParaOUsuario[i].id}" onclick="play_quizz(this.dataset.id)"></div>
                <div class="edit-and-delet-quizz">
                        <ion-icon class="icones" name="create-outline"></ion-icon>
                        <ion-icon onclick = "confirmarEnxclusao(${listaDeQuizzesfiltradasParaOUsuario[i].id})" class="icones" name="trash-outline"></ion-icon>
                </div>
                <p class="text_quizz">${listaDeQuizzesfiltradasParaOUsuario[i].title}</p>  
            </div>`
    }
}

function renderizarQuizzes(listaDeQuizzes){
    const listaDeQuizzesGeral = listaDeQuizzes.filter(quizzesQueNaoSaoDoUsuario);
    console.log(listaDeQuizzesGeral);
    const quizzesContainer = document.querySelector('.all.quizzes');
    quizzesContainer.innerHTML = '';
    for(let i = 0; i < listaDeQuizzesGeral.length; i++){
        quizzesContainer.innerHTML += `
        <div data-test="others-quiz" class="container-quizz pointer" data-id = "${listaDeQuizzesGeral[i].id}" onclick="play_quizz(this.dataset.id)">
            <div class="quizz-transparency"></div>
            <img class="quizz-img"src="${listaDeQuizzesGeral[i].image}"/>
            <p class="text_quizz">${listaDeQuizzesGeral[i].title}</p>  
        </div>`
    }
}

function buscarQuizzes(){
    const promiseQuizzes = axios.get(endpoints.quizzes);
    promiseQuizzes.then(quizzesBuscados => {
        renderizarUserQuizzes(quizzesBuscados.data);
        renderizarQuizzes(quizzesBuscados.data);
        console.log(quizzesBuscados.data);

        if (counterSEND !== 3.4) {
            document.getElementById('page_reloading').classList.add('hide');
            document.getElementById('page_1').classList.remove('hide');
        }

    });
    promiseQuizzes.catch(erroNaBuscaDosQuizzes => {
        console.log('Não foi possível conectar com o servidor');
    });
}
buscarQuizzes();
buscarQuizzesDoUsuario();
let stop_buscarQuizzes = setInterval(buscarQuizzes, 5000);

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//GABRIEL-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//função para verificar se o objeto é um url de imagem válido
function isURL(obj) {
    var pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(\/.*)?$/i;
    return pattern.test(obj);
}
//função para verificar se o objeto é uma cor hexadecimal valida
function isHexColor(obj) {
    var hexRegex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    return hexRegex.test(obj);
}
//----------------------------------------------------------
function home_after_create() {

    setInterval(buscarQuizzes, 5000);

    document.getElementById('page_1').classList.remove('hide');
    document.getElementById('page_3.4').classList.add('hide');

    window.scrollTo(0, 0);
}
//----------------------------------------------------------
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
            <input data-test="question-input" class="inputs-page-3" type="text" placeholder="Texto da pergunta">
            <input data-test="question-color-input" class="inputs-page-3" type="text" placeholder="Cor de fundo da pergunta">
            <p>Resposta correta</p>
            <input data-test="correct-answer-input" class="inputs-page-3" type="text" placeholder="Resposta correta">
            <input data-test="correct-img-input" class="inputs-page-3" type="text" placeholder="URL da imagem">
            <p>Respostas incorretas</p>
            <input data-test="wrong-answer-input" class="inputs-page-3" type="text" placeholder="Resposta incorreta 1">
            <input data-test="wrong-img-input" class="inputs-page-3 input_margin" type="text" placeholder="URL da imagem 1">
            <input data-test="wrong-answer-input" class="inputs-page-3" type="text" placeholder="Resposta incorreta 2">
            <input data-test="wrong-img-input" class="inputs-page-3 input_margin" type="text" placeholder="URL da imagem 2">
            <input data-test="wrong-answer-input" class="inputs-page-3" type="text" placeholder="Resposta incorreta 3">
            <input data-test="wrong-img-input" class="inputs-page-3 input_margin" type="text" placeholder="URL da imagem 3">
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
            <input data-test="level-input" class="inputs-page-3" type="text" placeholder="Título do nível">
            <input data-test="level-percent-input" class="inputs-page-3" type="text" placeholder="% de acerto mínima">
            <input data-test="level-img-input" class="inputs-page-3" type="text" placeholder="URL da imagem do nível">
            <textarea data-test="level-description-input" class="inputs-page-3 simulate_text_area" placeholder="Descrição do nível"></textarea>
        </div>
    `;
}

//------------------------------------------------------------------------------
let created_quizz = {};
//--------------------------------------
const backup_html_3_2 = document.getElementById('page_3.2').innerHTML;
const backup_html_3_3 = document.getElementById('page_3.3').innerHTML;
//------
//para guardarem a forma como as paginas 2 e 3 estavam antes de serem resetadas após o usuario terminar de criar o quizz
let edit_html_3_2;
let edit_html_3_3;
//--------------------------------------
let ARR_3_1, ARR_3_2, T, U, N, P, ARR_3_3, counterSEND;
/*a cada sub página da página 3.1 o conteudo da variavel element vai mudar, assim alterando qual botão 
será liberado com base nos inputs de cada página, usando a função enable e ENABLE_button*/
let element;
// let error_3_2, error_3_3; //não há na da pagina 3.1 porque a quantidade de inputs é fixa, foi facil de implementar a verficação
let stop_3_1, stop_3_3; //não há stop_3_2 pq na pagina 3.2 da pra continuar sem preencher tudo, então ná há setInterval nela
//------------------------------------------------------------------------------------------------------------------------------
function MY_play_quizz() {
    play_quizz(runtime_data.currentQuizId);
}
//------------------------------------------
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
        await_promise.catch(error => {
            alert(`Ocorreu algum erro, perdão, tente novamente.\n\n${error.message}`);
            window.location.reload();
        });
        await_promise.then( sucess => {

            //salvei o id do quizz criado e visualizado na variavel do pedro, para ser usada na função play_quizz do botão da tela 3.4
            runtime_data.currentQuizId = sucess.data.id;

            //o id atual será usado como parametro na função da gisele
            saveQuizzInLocalstorage(sucess.data.id, sucess.data.key);

            document.getElementById('page_reloading').classList.add('hide');
            document.getElementById('page_3.4').classList.remove('hide');

            buscarQuizzes();

            your_quizz = document.querySelector('.quizz-finalizado');
            your_quizz.innerHTML = `
                <div data-test="sucess-banner" class="your-container-quizz pointer" onclick="play_quizz(runtime_data.currentQuizId)">
                    <div class="your-quizz-transparency"></div>
                    <img class="your-quizz-img"src="${U}"/>
                    <p class="your-text_quizz">${T}</p>  
                </div>
            `;
            
            //reseta o conteudo das paginas 3.2 e 3.3 para o padrão, com somente uma pergunta e nivel
            document.getElementById('page_3.2').innerHTML = backup_html_3_2;
            document.getElementById('page_3.3').innerHTML = backup_html_3_3;
        });
    }
}
//----------------------------------------------------------------------------------------
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

//-------------------------------
/*precisei fazer a função ENABLE button ser chamada após essa nova porque usar setInterval 
para chamar uma função inserindo um parametro faz ela ser executada somente uma vez*/

/*chama a função ENABLE_button (usando o id do elemento da página ATUAL como parametro)*/
function enable () {
    ENABLE_button(element.id);
}

//-----------------------------------------------------------
function create_quizz() {

    clearInterval(stop_buscarQuizzes);

    counterSEND = 3.1;

    //esconde a page 1 e mostra a page 3.1
    document.getElementById('page_1').classList.add('hide');

    //é aqui onde é definido qual página a função enable e ENABLE_button vão levar em consideração
    element = document.getElementById('page_3.1');
    element.classList.remove('hide');
    //chama a função enable a cada 0,1 segundos
    stop_3_1 = setInterval(enable, 100);

}
//-----------------------------------------------------------
function send_3_1() {

    clearInterval(stop_3_1);

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
        alert('Título do quizz: deve ter no mínimo 20 e no máximo 65 caracteres.\n\nURL da Imagem: deve ter formato de URL e extensão de imagem.\n\nQuantidade de perguntas: no mínimo 3 perguntas.\n\nQuantidade de níveis: no mínimo 2 níveis');
    } else {
            
        //apaga os value digitados nos inputs equivalente a página selecionada pelas funções enable e ENABLE_button
        FOR_E_button.forEach( array => {array.value = "";});

//------------------------        
        counterSEND = 3.2;

        document.getElementById('page_3.1').classList.add('hide');
        const P_3_2 = document.getElementById('page_3.2');
        P_3_2.classList.remove('hide');
        //IMPORTANTE://
        /*aqui o valor de element não muda, já que a função enable não sera usada para verificar 
        se todos os inputs estão preenchdidos, já que na pagina 3.2 da pra continuar sem preencher tudo*/
        const B_3_2 = P_3_2.querySelector('.botão-page-3');
        B_3_2.disabled = false;
        B_3_2.classList.add('pointer');
        B_3_2.addEventListener('click', send);
    
        //renderiza na tela 3.2 divs com perguntas em numero equivalente ao escolhido pelo usuario
        let answer = document.getElementById('answers');
        for (let i = 0; i < P-1; i++) {
    
            answer.innerHTML += `
                <div data-test="question-ctn" onclick="toggle_answer(this)" class="container-edits pointer">
                    <p>Pergunta ${i+2}</p>
                    <ion-icon data-test="toggle" class="icone-edit" name="create-outline"></ion-icon>
                </div>
            `;
            
        }
        edit_html_3_2 = document.getElementById('page_3.2').innerHTML;
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

    //não há setInterval para a página 3.2
    let error_3_2 = false;
    let TEMP_array = [];

    ARR_3_2 = {obj_perguntas: []};

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

    //-------------------------------

        if (right_P === "" || text_P.length < 20 || isHexColor(color_P) === false || isURL(right_P_img) === false) { 
            error_3_2 = true;
        }
        //-----
        if (wrong_P1 === "" && wrong_P2 === "" && wrong_P3 === ""){
            error_3_2 = true;
        }
        //-----
        if ((wrong_P1_img !== "" && isURL(wrong_P1_img) === false) || (wrong_P2_img !== "" && isURL(wrong_P2_img) === false) || (wrong_P3_img !== "" && isURL(wrong_P3_img) === false)) {
            error_3_2 = true;
        }
        //-----
        if ((wrong_P1 === "" && wrong_P1_img !== "") || (wrong_P2 === "" && wrong_P2_img !== "") || (wrong_P3 === "" && wrong_P3_img !== "")) {
            error_3_2 = true;
        }
        //-----
        if ((wrong_P1_img === "" && wrong_P1 !== "") || (wrong_P2_img === "" && wrong_P2 !== "") || (wrong_P3_img === "" && wrong_P3 !== "")) {
            error_3_2 = true;
        }
    //---------------
        if (error_3_2 === false) {

            let rP = 
            {
                text: right_P,
                image: right_P_img,
                isCorrectAnswer: true
            }
            TEMP_array.push(rP);
        //-----
        let wP1 = 
            {
                text: wrong_P1,
                image: wrong_P1_img,
                isCorrectAnswer: false
            }
        if (wrong_P1 !== "") {
            TEMP_array.push(wP1);
        }
        //-----
        let wP2 = 
            {
                text: wrong_P2,
                image: wrong_P2_img,
                isCorrectAnswer: false
            }
        if (wrong_P2 !== "") {
            TEMP_array.push(wP2);
        }
        //-----
        let wP3 = 
            {
                text: wrong_P3,
                image: wrong_P3_img,
                isCorrectAnswer: false
            }
        if (wrong_P3 !== "") {
            TEMP_array.push(wP3);
        }
        //---------------------------
        created_quizz.questions.push (
            {
                title: text_P,
                color: color_P,
                answers: TEMP_array
            }
        );

        console.log(TEMP_array);
        TEMP_array = [];
        }
    }
    //------------
    if (error_3_2 === false) {

        //reseta o contador da função toggle_answer(clicked)
        answer_counter = 0;
        //apaga os value digitados nos inputs da página 3.2
        let erase_inputs = document.getElementById('page_3.2');
        erase_inputs = erase_inputs.querySelectorAll('.inputs-page-3');
        erase_inputs.forEach( array => {array.value = "";});

    //------------------------
        counterSEND = 3.3;

        document.getElementById('page_3.2').classList.add('hide');
        //element será redefinido para levar a page 3.3 em consideração com as funções enable e ENABLE_button
        element = document.getElementById('page_3.3');
        element.classList.remove('hide');
        //chama a função enable a cada 0,1 segundos
        stop_3_3 = setInterval(enable, 100);

        //renderiza na tela 3.3 divs com niveis em numero equivalente ao escolhido pelo usuario
        const level = document.getElementById('levels');
        for (let i = 0; i < N-1; i++) {
            
            level.innerHTML += `
                <div onclick="toggle_level(this)"data-test="level-ctn" class="container-edits pointer">
                    <p>Nível ${i+2}</p>
                    <ion-icon data-test="toggle" class="icone-edit" name="create-outline"></ion-icon>
                </div>
            `;
        }
        edit_html_3_3  = document.getElementById('page_3.3').innerHTML;

    } else {

        alert('Texto da pergunta: no mínimo 20 caracteres.\n\nCor de fundo: deve ser uma cor em hexadecimal.\n\nTextos da resposta certa: não pode estar vazio.\n\nURL das imagens de resposta: deve ter formato de URL e extensão de imagem.\n\nNão dá pra inserir somente a imagem OU o nome nas respostas, precisa ser os dois');

    }
}
//----------------------------------------------------------
function send_3_3 () {

    clearInterval(stop_3_3);

    let error_3_3 = false;
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
        //-----------
        const some_zero = created_quizz.levels.some( obj => obj.minValue === 0);

        if (some_zero === false || text_N.length < 10 || isNaN(min_N) !== false || parseInt(ARR_3_3.obj_niveis[0][1]) !== 0 || min_N < 0 || min_N > 100 || isURL(url_N) === false || desc_N.length < 30) {

            error_3_3 = true;

        }
    }
    //------------  
    if (error_3_3 === false) {

        console.log(created_quizz);
        
        //reseta o contador da função toggle_level(clicked)
        level_counter = 0;
        //apaga os value digitados nos inputs equivalente a página selecionada pelas funções enable e ENABLE_button
        FOR_E_button.forEach( array => {array.value = "";});
    //------------------------ 
    
        counterSEND = 3.4;

        document.getElementById('page_3.3').classList.add('hide');
        document.getElementById('page_reloading').classList.remove('hide');

        send();

    } else {

        alert('Título do nível: mínimo de 10 caracteres.\n\nURL da imagem do nível: deve ter formato de URL e extensão de imagem.\n\nDescrição do nível: mínimo de 30 caracteres.\n\nÉ obrigatório existir pelo menos 1 nível cuja % de acerto mínima seja 0%, e o valor precisa ser de 0 a 100.\n\n');

    }
}



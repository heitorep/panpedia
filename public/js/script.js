/* Cria a barra de pesquisa, botão de busca e os filtros */
const searchInput = document.getElementById('inputPesquisa');
const searchBtn = document.getElementById('botaoPesquisa');
var darkMode = false;

/*Dark Mode */
$(document).ready(function() {
    // Verifica se o modo escuro está ativado ou não
    darkMode = localStorage.getItem("darkMode")  === 'true'; 

    // Esconde as imagens 3 e 4
    $('#imagem3').hide();
    $('#imagem4').hide();
    $('#estrelinhas').hide();

    // Obtém a referência ao elemento body
    var element = document.body;

    var checkbox = document.getElementById("bolabtn");

    checkbox.checked = darkMode;


    if (darkMode) {
        // Se o modo escuro estiver ativado, mostra as imagens 3 e 4, e adiciona a classe "darkMode" ao body
        $('#imagem1').hide();
        $('#imagem3').show();
        $('#imagem2').hide();
        $('#imagem4').show();
        $('#estrelinhas').show();
        element.classList.add("darkMode");
    } else {
        // Caso contrário, mostra as imagens 1 e 2
        $('#imagem1').show();
        $('#imagem3').hide();
        $('#imagem2').show();
        $('#imagem4').hide();
        $('#estrelinhas').hide();
    }
});

function funcaoDarkMode() {
    // Obtém a referência ao elemento body
    var element = document.body;

    if (darkMode === false) {
        // Se o modo escuro estiver desativado, esconde as imagens 1 e 2, mostra as imagens 3 e 4, 
        // define darkMode como true, salva o valor em localStorage e adiciona a classe "darkMode" ao body
        $('#imagem1').hide();
        $('#imagem3').show();
        $('#imagem2').hide();
        $('#imagem4').show();
        $('#estrelinhas').hide();
        darkMode = true;
        console.log('darkMode', darkMode);
        localStorage.setItem("darkMode", darkMode);
        element.classList.add("darkMode");
    } else {
        // Caso contrário, mostra as imagens 1 e 2, esconde as imagens 3 e 4,
        // define darkMode como false, salva o valor em localStorage e remove a classe "darkMode" do body
        $('#imagem1').show();
        $('#imagem3').hide();
        $('#imagem2').show();
        $('#imagem4').hide();
        $('#estrelinhas').show();
        darkMode = false;
        localStorage.setItem("darkMode", darkMode);
        element.classList.remove("darkMode");
    }
    
}

/* Abre a overlay do menu lateral */
function abrirNav() {
    document.getElementById("menuLateral").style.width = "250px";
}

/* Fecha o overlay do menu lateral */
function fecharNav() {
    document.getElementById("menuLateral").style.width = "0";
}

/* Popup Sugerir Alteração (página de metadados) */
const button = document.querySelector('.btnLapis')
const popup = document.querySelector('.popup-wrapper')

button.addEventListener('click', () => {
    popup.style.display = 'block'
})

popup.addEventListener('click', event => {
    const classNameOfClickedElement = event.target.classList[0]

    if (classNameOfClickedElement === 'popup-close' || classNameOfClickedElement === 'popup-link' || classNameOfClickedElement === 'popup-wrapper') {
        popup.style.display = 'none'
    }
    
})

/* Alerta ao enviar Sugestão de Alteração (página de metadados) */
$('form[name="form1"]').submit(function(e){
    e.preventDefault(); // Evita que o formulário seja enviado da maneira padrão
    $.post($(this).attr('action'), $(this).serialize(), function(data){
      // Aqui você pode lidar com a resposta do servidor após o POST
      alert('Alteração sugerida com sucesso!');
    });
  });

  $(document).ready(function() {
    $(".fechar").click(function() {
        var id = $(this).data('id'); // Pega o ID do botão clicado
        var that = this; // Referência para o botão clicado
        $.get("/analisado", {ID_ALTERACAO: id}, function(data, status) {
            if (status === "success") {
                $(that).parent().remove(); // Remove o card do botão clicado
            } else {
                alert("Erro ao remover a alteração!");
            }
        });
    });
});
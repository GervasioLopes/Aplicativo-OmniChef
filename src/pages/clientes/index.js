document.getElementById("formCliente").addEventListener("submit", function(e) {
    e.preventDefault();

    // Pegar valores dos inputs
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value;

    // Seleciona o campo de mensagem
    const mensagem = document.getElementById("mensagem");

    // Exibir dados no console (simulando envio para backend)
    console.log("📌 Novo cliente cadastrado:");
    console.log("Nome:", nome);
    console.log("Telefone:", telefone);
    console.log("CPF:", cpf);
    console.log("Data de Nascimento:", dataNascimento);

    // Exibe mensagem de sucesso no HTML
    mensagem.textContent = "✅ Cliente cadastrado com sucesso!";
    mensagem.style.color = "green";

    // Limpar formulário
    document.getElementById("formCliente").reset();

    // Remover mensagem depois de alguns segundos
    setTimeout(() => {
        mensagem.textContent = "";
    }, 4000);
});
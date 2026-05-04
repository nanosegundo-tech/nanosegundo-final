document.getElementById('partnerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Captura todos os dados e arquivos
    const formData = new FormData(this);

    console.log("Iniciando sincronização com a aplicação...");

    // URL onde seu sistema C++ está escutando
    fetch('http://localhost:8080/api/partnerships', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if(response.ok) {
            alert("✓ Dados sincronizados com sucesso!");
            this.reset();
        }
    })
    .catch(error => {
        console.error("Erro na comunicação com o backend:", error);
        alert("Falha na sincronização. Verifique se o servidor C++ está ativo.");
    });
});
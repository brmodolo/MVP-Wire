import React, { useState } from 'react';

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
    setResultado(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      alert("Por favor, selecione um arquivo de áudio.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);

    setLoading(true);
    try {
      const response = await fetch("https://mvp-wire-back.onrender.com/avaliar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar o arquivo.");
      }

      const data = await response.json();
      setResultado(data);
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      setResultado({ erro: "Ocorreu um erro ao enviar os arquivos." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Envio de Produção Oral</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".wav,.mp3" onChange={handleFileChange} />
        <button type="submit" disabled={loading} style={{ marginLeft: '1rem' }}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {resultado && (
        <div style={{
          marginTop: '2rem',
          backgroundColor: '#f4f4f4',
          padding: '1rem',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap'
        }}>
          <h2>Resultado</h2>
          {resultado.erro ? (
            <p>{resultado.erro}</p>
          ) : (
            <>
              <p><strong>Tema:</strong> {resultado.tema}</p>
              <p><strong>Transcrição:</strong> {resultado.transcricao_producao}</p>
              <p><strong>Similaridade:</strong> {resultado.similaridade_percentual}%</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

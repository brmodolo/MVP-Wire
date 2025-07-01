import React, { useState } from 'react';

function App() {
  const [aula, setAula] = useState(null);
  const [explicacao, setExplicacao] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    if (!aula || !explicacao) {
      setErro('Por favor, envie os dois arquivos.');
      return;
    }

    const formData = new FormData();
    formData.append('aula', aula);
    formData.append('explicacao', explicacao);

    try {
      const response = await fetch('https://mvp-wire-back.onrender.com/avaliar', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      console.log('Resposta bruta do backend:', text);

      if (!response.ok) {
        throw new Error(text || 'Erro na requisição');
      }

      const data = JSON.parse(text);
      setResultado(data);
    } catch (err) {
      console.error('Erro ao enviar arquivos:', err);
      setErro('Ocorreu um erro ao enviar os arquivos.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Avaliador de Aprendizagem Ativa</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Arquivo da aula (ex: .txt): </label>
          <input type="file" accept=".txt,.pdf,.pptx" onChange={(e) => setAula(e.target.files[0])} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Arquivo da explicação do aluno (ex: .wav, .mp4, .txt): </label>
          <input type="file" accept=".wav,.mp4,.txt" onChange={(e) => setExplicacao(e.target.files[0])} />
        </div>
        <button type="submit">Enviar</button>
      </form>

      {erro && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <strong>{erro}</strong>
        </div>
      )}

      {resultado && (
        <div style={{
          marginTop: '2rem',
          backgroundColor: '#f4f4f4',
          padding: '1rem',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap'
        }}>
          <h2>Resultado</h2>
          <p><strong>Tema:</strong> {resultado.tema || 'N/A'}</p>
          <p><strong>Transcrição:</strong> {resultado.transcricao_producao || 'N/A'}</p>
          <p><strong>Similaridade:</strong> {resultado.similaridade_percentual}%</p>
        </div>
      )}
    </div>
  );
}

export default App;

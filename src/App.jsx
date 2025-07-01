import React, { useState } from 'react';

function App() {
  const [aulaFile, setAulaFile] = useState(null);
  const [producaoFile, setProducaoFile] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResultado(null);
    setErro(null);

    const formData = new FormData();
    formData.append('aula', aulaFile);
    formData.append('producao', producaoFile);

    try {
      const response = await fetch('https://mvp-wire-back.onrender.com/avaliar/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar os arquivos');
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      console.error(err);
      setErro('Ocorreu um erro ao enviar os arquivos.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Avaliador de Aprendizagem Ativa</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Aula (áudio .wav):</label><br />
          <input type="file" accept=".wav" onChange={(e) => setAulaFile(e.target.files[0])} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Produção do aluno (áudio .wav):</label><br />
          <input type="file" accept=".wav" onChange={(e) => setProducaoFile(e.target.files[0])} required />
        </div>
        <button type="submit">Enviar</button>
      </form>

      {erro && (
        <div style={{ marginTop: '1rem', color: 'red' }}>{erro}</div>
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
          <p><strong>Tema detectado:</strong> {resultado.tema}</p>
          <p><strong>Transcrição da Produção:</strong> {resultado.transcricao_producao}</p>
          <p><strong>Similaridade (%):</strong> {resultado.similaridade_percentual}</p>
        </div>
      )}
    </div>
  );
}

export default App;

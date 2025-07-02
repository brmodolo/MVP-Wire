import React, { useState } from 'react';

function App() {
  const [aula, setAula] = useState(null);  // txt do professor
  const [audio, setAudio] = useState(null); // áudio do aluno
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aula || !audio) {
      setErro('Por favor, selecione os dois arquivos.');
      return;
    }

    const formData = new FormData();
    formData.append('video', aula);  // ainda usamos "video" para compatibilidade com o backend
    formData.append('audio', audio);

    try {
      const response = await fetch('https://mvp-wire-back.onrender.com/avaliar/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar os arquivos.');
      }

      const data = await response.json();
      setResultado(data);
      setErro('');
    } catch (err) {
      setErro('Ocorreu um erro ao enviar os arquivos.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Validador de Produção</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div>
          <label>Aula do Professor (.txt):</label><br />
          <input type="file" accept=".txt" onChange={(e) => setAula(e.target.files[0])} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Áudio do Aluno:</label><br />
          <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Enviar</button>
      </form>

      {erro && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {erro}
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
          <p><strong>Tema:</strong> {resultado.tema}</p>
          <p><strong>Transcrição:</strong> {resultado.transcricao_producao}</p>
          <p><strong>Similaridade:</strong> {resultado.similaridade_percentual}%</p>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';

function App() {
  const [audio, setAudio] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audio) {
      setErro('Por favor, selecione o áudio do aluno.');
      return;
    }

    const formData = new FormData();
    formData.append('producao', audio); // campo esperado no backend
    formData.append('tema', 'Teste');

    try {
      const response = await fetch('https://mvp-wire-back.onrender.com/avaliar/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(`Erro ${response.status}: ${msg}`);
      }

      const data = await response.json();
      setResultado(data);
      setErro('');
    } catch (err) {
      console.error(err);
      setErro(`Ocorreu um erro: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Validador de Produção</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Áudio do Aluno (.wav ou .mp3):</label><br />
          <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Enviar</button>
      </form>

      {erro && <div style={{ color: 'red', marginTop: '1rem' }}>{erro}</div>}

      {resultado && (
        <div style={{ marginTop: '2rem', backgroundColor: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
          <h2>Resultado</h2>
          <p><strong>Tema:</strong> {resultado.tema}</p>
          <p><strong>Transcrição:</strong> {resultado.transcricao_producao}</p>
          <p><strong>Similaridade:</strong> {resultado.similaridade_percentual}%</p>
          <p><strong>Feedback:</strong> {resultado.feedback}</p>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';

function App() {
  const [texto, setTexto] = useState(null); // .txt do professor
  const [audio, setAudio] = useState(null); // .wav do aluno
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!texto || !audio) {
      setErro('Por favor, selecione o TXT da aula e o áudio do aluno.');
      return;
    }

    const formData = new FormData();
    formData.append('aula', texto);             // campo correto!
    formData.append('producao', audio);         // campo correto!
    formData.append('tema', 'Teste');           // campo obrigatório!

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
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div>
          <label>Texto da Aula (.txt):</label><br />
          <input type="file" accept=".txt" onChange={(e) => setTexto(e.target.files[0])} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Áudio do Aluno (.wav):</label><br />
          <input type="file" accept="audio/wav" onChange={(e) => setAudio(e.target.files[0])} />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Enviar</button>
      </form>

      {erro && <div style={{ color: 'red', marginBottom: '1rem' }}>{erro}</div>}

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

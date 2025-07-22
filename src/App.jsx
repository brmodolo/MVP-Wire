import React, { useState } from 'react';

function App() {
  const [audio, setAudio] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audio) {
      setErro('Por favor, selecione o arquivo de áudio do aluno.');
      return;
    }

    const formData = new FormData();
    formData.append('producao', audio);
    formData.append('tema', 'Tema genérico');

    try {
      setCarregando(true);
      setResultado(null);
      setErro('');

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
    } catch (err) {
      console.error(err);
      setErro(`Ocorreu um erro: ${err.message}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem' }}>
        Envie sua explicação em um arquivo de áudio e confira o quanto aprendeu sobre o conteúdo.
      </h1>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <label>Áudio do Aluno (.wav):</label><br />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files[0])}
          style={{ marginTop: '0.5rem' }}
        /><br />
        <button type="submit" disabled={carregando} style={{ marginTop: '1rem' }}>
          Enviar
        </button>
      </form>

      {carregando && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
          <div style={{
            border: '4px solid #ccc',
            borderTop: '4px solid #333',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            marginRight: '10px',
            animation: 'spin 1s linear infinite'
          }} />
          <span>Processando... isso pode levar alguns segundos.</span>

          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {erro && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
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
          <p><strong>Transcrição:</strong> {resultado.transcricao_producao}</p>
          <p><strong>Similaridade:</strong> {resultado.similaridade_percentual}%</p>
          <p><strong>Feedback:</strong> {resultado.feedback}</p>
        </div>
      )}
    </div>
  );
}

export default App;

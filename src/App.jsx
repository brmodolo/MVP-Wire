import React, { useState } from 'react';

function App() {
  const [aula, setAula] = useState(null);
  const [explicacao, setExplicacao] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aula || !explicacao) {
      setErro('Por favor, selecione os dois arquivos.');
      return;
    }

    const formData = new FormData();
    formData.append('aula', aula);
    formData.append('explicacao', explicacao);

    setCarregando(true);
    setErro(null);
    setResultado(null);

    try {
      const response = await fetch('https://mvp-wire-back.onrender.com/avaliar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      console.error(err);
      setErro('Ocorreu um erro ao enviar os arquivos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Validação de Aprendizagem</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div>
          <label>Aula (vídeo ou texto): </label>
          <input type="file" onChange={(e) => setAula(e.target.files[0])} accept="video/*,.txt" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Explicação do aluno (áudio, vídeo ou texto): </label>
          <input type="file" onChange={(e) => setExplicacao(e.target.files[0])} accept="audio/*,video/*,.txt" />
        </div>
        <button type="submit" style={{ marginTop: '1.5rem' }} disabled={carregando}>
          {carregando ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {erro && (
        <div style={{ marginTop: '2rem', color: 'red' }}>
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
          <p><strong>Tema:</strong> {resultado.tema}</p>
          <p><strong>Transcrição:</strong> {resultado.transcricao_producao}</p>
          <p><strong>Similaridade:</strong> {resultado.similaridade_percentual}%</p>
        </div>
      )}
    </div>
  );
}

export default App;

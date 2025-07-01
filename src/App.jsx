import React, { useState } from 'react';

function App() {
  const [aula, setAula] = useState(null);
  const [explicacao, setExplicacao] = useState(null);
  const [resultado, setResultado] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('aula', aula);
    formData.append('explicacao', explicacao);

    try {
      const res = await fetch('https://mvp-wire-back.onrender.com/avaliar/', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResultado(data);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      setResultado({ avaliacao_gerada: 'Erro ao processar. Tente novamente.' });
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>LMS Evaluator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Aula (txt ou pptx):</label><br />
          <input type="file" onChange={(e) => setAula(e.target.files[0])} required />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Explicação do aluno (texto, áudio, vídeo ou slides):</label><br />
          <input type="file" onChange={(e) => setExplicacao(e.target.files[0])} required />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Enviar</button>
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
          <p>{resultado.avaliacao_gerada || 'Nenhuma avaliação retornada.'}</p>
        </div>
      )}
    </div>
  );
}

export default App;

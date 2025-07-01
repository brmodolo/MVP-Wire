import { useState } from 'react';

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('audio', audioFile);

    setLoading(true);
    setErro(null);

    try {
      const response = await fetch('https://mvp-wire-back.onrender.com/avaliar/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erro na requisição');

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setErro('Ocorreu um erro ao enviar os arquivos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>MVP Wire - Avaliação de Aprendizagem</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".wav"
          onChange={(e) => setAudioFile(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {erro && (
        <p style={{ color: 'red', marginTop: '1rem' }}>{erro}</p>
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

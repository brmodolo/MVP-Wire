import React, { useState } from 'react'

function App() {
  const [aula, setAula] = useState(null)
  const [explicacao, setExplicacao] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setErro(null)
    setResultado(null)

    const formData = new FormData()
    formData.append('aula', aula)
    formData.append('explicacao', explicacao)

    try {
      const response = await fetch('https://mvp-wire-back.onrender.com/avaliar/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar os arquivos.')
      }

      const data = await response.json()
      setResultado(data)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Avaliador de Aprendizagem</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div>
          <label>Aula (PDF ou PPTX): </label>
          <input type="file" accept=".pdf,.pptx" onChange={e => setAula(e.target.files[0])} required />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Explicação (vídeo ou texto): </label>
          <input type="file" accept="video/*,.txt" onChange={e => setExplicacao(e.target.files[0])} required />
        </div>
        <button type="submit" disabled={carregando} style={{ marginTop: '1rem' }}>
          {carregando ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {erro && <p style={{ color: 'red' }}>Erro: {erro}</p>}

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
          <p><strong>Transcrição da produção:</strong> {resultado.transcricao_producao}</p>
          <p><strong>Similaridade (%):</strong> {resultado.similaridade_percentual}%</p>
        </div>
      )}
    </div>
  )
}

export default App


import React, { useState } from 'react'

function App() {
  const [aula, setAula] = useState(null)
  const [explicacao, setExplicacao] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResultado(null)

    const formData = new FormData()
    formData.append('aula', aula)
    formData.append('producao', explicacao)

    try {
      const res = await fetch('https://mvp-wire-back.onrender.com/avaliar/', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      setResultado(data.avaliacao_gerada || JSON.stringify(data, null, 2))
    } catch (err) {
      setResultado("Erro ao enviar os dados. Verifique o backend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>LMS Evaluator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Aula (txt ou pptx):</label><br />
          <input type="file" onChange={e => setAula(e.target.files[0])} required />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Explicação do aluno (texto, áudio, vídeo ou slides):</label><br />
          <input type="file" onChange={e => setExplicacao(e.target.files[0])} required />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Enviar</button>
      </form>

      {loading && <p>Processando...</p>}

      {resultado && (
  <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap', backgroundColor: '#f7f7f7', padding: '1rem', borderRadius: '8px' }}>
    <h2>Resultado</h2>
    <p>{resultado.avaliacao_gerada}</p>
  </div>
)}

export default App

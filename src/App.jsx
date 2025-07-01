
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
    formData.append('explicacao', explicacao)

    try {
      const res = await fetch('https://mvp-wire-back.onrender.com/avaliar/', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      setResultado(data)
    } catch (error) {
      setResultado({ erro: 'Erro ao conectar com o servidor.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
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
        <button type="submit" style={{ marginTop: '1rem' }}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
          <h2>Resultado</h2>
          {resultado.erro ? (
            <p style={{ color: 'red' }}>Erro: {resultado.erro}</p>
          ) : (
            <pre>{JSON.stringify(resultado, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  )
}

export default App

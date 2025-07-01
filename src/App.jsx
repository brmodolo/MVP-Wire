import React, { useState } from 'react'

function App() {
  const [aula, setAula] = useState(null)
  const [explicacao, setExplicacao] = useState(null)
  const [resultado, setResultado] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('aula', aula)
    formData.append('explicacao', explicacao)

    try {
      const res = await fetch('https://mvp-wire-back.onrender.com/avaliar/', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        throw new Error('Erro na requisição')
      }

      const data = await res.json()
      setResultado(data)
    } catch (err) {
      console.error(err)
      setResultado({ erro: 'Ocorreu um erro ao enviar os arquivos.' })
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>LMS Evaluator</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Aula (txt ou pptx):</strong></label><br />
          <input type="file" onChange={e => setAula(e.target.files[0])} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Explicação do aluno (texto, áudio, vídeo ou slides):</strong></label><br />
          <input type="file" onChange={e => setExplicacao(e.target.files[0])} required />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Enviar</button>
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
          {resultado.erro ? (
            <p style={{ color: 'red' }}>{resultado.erro}</p>
          ) : (
            <>
              <p><strong>Tema:</strong> {resultado.tema || 'Não identificado'}</p>
              <p><strong>Transcrição da explicação:</strong> {resultado.transcricao_producao || 'Não disponível'}</p>
              <p><strong>Similaridade:</strong> {resultado.similaridade_percentual ?? 'N/A'}%</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default App

import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { LabelVideoInput } from './label-video-input'
import { render, screen } from '@testing-library/react'

describe('InputVideo', () => {
  it('deve renderizar o label com a mensagem para selecionar um novo vídeo', () => {
    render(<LabelVideoInput preview={null} />)
    const label = screen.getByText('Selecione um vídeo')
    expect(label).toBeInTheDocument()
  })

  it('deve mostrar preview do vídeo', () => {
    const previewUrl =
      'blob:http://localhost:5173/587bd8a4-d3c9-4ca4-8805-f056802dbc41'
    render(<LabelVideoInput preview={previewUrl} />)
    const videoElement = screen.getByTestId('video-preview')
    expect(videoElement).toBeInTheDocument()
  })
})

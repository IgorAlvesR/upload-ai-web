import '@testing-library/jest-dom'
import '@/lib/adaptSelectShadcnui'
import { describe,  expect, it} from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptSelect } from './prompt-select';
import { server } from '@/msw';
import { rest } from 'msw'

const mockRequests = {
  response200: rest.get('http://localhost:3333/prompts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([{
      id: '1',
      title: 'Prompt 01',
      template: 'Conteúdo do prompt'
    }]))
  }),
  response404:  rest.get('http://localhost:3333/prompts', (req, res, ctx) => {
    return res(ctx.status(404), ctx.json({
      message: 'Erro'
    }))
  }),
}

describe('PromptSelect', () => {    
  it('deve renderizar as opções do prompt select', async () => {    
    server.use(mockRequests.response200)
    const user = userEvent.setup()
    render(<PromptSelect onPromptSeleted={() => {}} />) 
    const select = screen.getByRole('combobox')    
    await user.click(select)    
    const option = screen.getByText('Prompt 01')    
    expect(option).toBeInTheDocument()
  })

  it('deve mostrar que não foi possível exibir os prompts', async () => {    
    server.use(mockRequests.response404)
    const user = userEvent.setup()
    render(<PromptSelect onPromptSeleted={() => {}} />) 
    const select = screen.getByRole('combobox')    
    await user.click(select)    
    const option = screen.getByText('Não foi possível carregar prompts')    
    expect(option).toBeInTheDocument()
  })
})
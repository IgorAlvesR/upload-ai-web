import { api } from '@/lib/axios'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select'
import { useEffect, useState } from 'react'

type Prompt = {
  id: string
  title: string
  template: string
}

type PromptSelectProps = {
  onPromptSeleted: (template: string) => void
}

enum Status {
  loading = 'loading',
  error = 'error',
}

export function PromptSelect(props: PromptSelectProps) {
  const [prompts, setPrompts] = useState<Prompt[] | []>([])
  const [status, setStatus] = useState<Status | null>(null)
  const isLoading = status === Status.loading

  useEffect(() => {
    setStatus(Status.loading)
    api
      .get('/prompts')
      .then((response) => {
        setPrompts(response.data)
        setStatus(null)
      })
      .catch(() => {
        setStatus(Status.error)
      })
  }, [])

  function handlePromptSeleted(promptId: string) {
    const seletedPrompt = prompts?.find((prompt) => prompt.id === promptId)
    if (!seletedPrompt) {
      return
    }
    props.onPromptSeleted(seletedPrompt.template)
  }

  return (
    <Select onValueChange={handlePromptSeleted} disabled={isLoading}>
      <SelectTrigger title={isLoading ? 'Carregando...' : ''}>
        <SelectValue placeholder="Selecione um prompt" />
      </SelectTrigger>

      <SelectContent>
        {status === Status.error ? (
          <SelectItem disabled value="">
            Não foi possível carregar prompts
          </SelectItem>
        ) : (
          prompts?.map((prompt) => (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

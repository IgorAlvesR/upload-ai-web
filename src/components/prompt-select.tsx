import { api } from "@/lib/axios";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { useEffect, useState } from "react";

interface Prompt {
  id: string
  title: string
  template: string
}

interface PromptSelectProps {
  onPromptSeleted: (template: string) => void
}

export function PromptSelect(props: PromptSelectProps) {
  
  const [prompts, setPrompts] = useState<Prompt[] | null>(null)

  useEffect(() => {
    api.get('/prompts').then(response => {
      console.log(response.data)
      setPrompts(response.data)
    })
  }, [])

  function handlePromptSeleted(promptId: string) {    
    const seletedPrompt = prompts?.find(prompt => prompt.id === promptId)

    if(!seletedPrompt) {
      return
    }

    props.onPromptSeleted(seletedPrompt.template)
  }
  
  return (
    <Select onValueChange={handlePromptSeleted} >
        <SelectTrigger>
            <SelectValue placeholder="Selecione um prompt" />
        </SelectTrigger>

        <SelectContent>
            {prompts?.map(prompt => {
                return (
                    <SelectItem key={prompt.id} value={prompt.id} >
                        {prompt.title}
                    </SelectItem>
                )
            })}
        </SelectContent>
    </Select>       
  )
}
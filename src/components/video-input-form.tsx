import { Label } from '@radix-ui/react-label'
import { Separator } from '@radix-ui/react-separator'
import { Upload } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { api } from '@/lib/axios'
import { LabelVideoInput } from './label-video-input'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  converting: 'Convertendendo...',
  generating: 'Transcrevendo...',
  uploading: 'Carregando...',
  success: 'Sucesso!',
}

type VideoInputFormProps = {
  onVideoUploaded: (videoId: string) => void
}

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)
  const [status, setStatus] = useState<Status>('waiting')

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) {
      return
    }

    const selectedFile = files[0]
    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('Convert started.')

    const ffmpeg = await getFFmpeg()
    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(video))
    } catch (error) {
      console.log(error)
    }

    /* ffmpeg.on('log', log => {
        console.log(log)
      }) */

    ffmpeg.on('progress', (progress) => {
      console.log('Convert progress', +Math.round(progress.progress * 100))
    })

    ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    console.log('Convert finished.')

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if (!videoFile) {
      return
    }

    setStatus('converting')

    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData()
    data.append('file', audioFile)

    setStatus('uploading')

    const response = await api.post('/videos', data)

    const videoId = response.data.video.id

    setStatus('generating')

    await api.post(`/videos/${videoId}/transcription`, { prompt })

    setStatus('success')

    props.onVideoUploaded(videoId)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form onSubmit={handleUploadVideo} className="space-y-6">
      <LabelVideoInput preview={previewURL} />

      <input
        className="sr-only"
        type="file"
        id="video"
        accept="video/mp4"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por (,)"
          disabled={status !== 'waiting'}
        />
      </div>

      <Button
        data-success={status === 'success'}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400"
        disabled={status !== 'waiting'}
      >
        {status === 'waiting' ? (
          <>
            Carregar vídeo
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  )
}

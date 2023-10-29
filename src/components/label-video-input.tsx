import { FileVideo } from 'lucide-react'

type InputVideoProps = {
  preview: string | null
}

export function LabelVideoInput({ preview }: InputVideoProps) {
  return (
    <label
      className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col items-center justify-center to-muted-foreground hover:bg-primary/5"
      htmlFor="video"
    >
      {preview ? (
        <video
          data-testid="video-preview"
          src={preview}
          controls={false}
          className="h-full pointer-events-none absolute inset-0"
        />
      ) : (
        <>
          <FileVideo className="w-4 h-4" />
          Selecione um vídeo
        </>
      )}
    </label>
  )
}

import assemblyai as aai
from elevenlabs.client import ElevenLabs
from elevenlabs import stream
import ollama

class AI_Assistant:
    def __init__(self) -> None:
        aai.settings.api_key = "1030257b80a145c0bc483fab531299df"
        self.client = ElevenLabs(
            api_key = "sk_afa7bdcb3e74cd51c672d1973729bd4b33ae3e330d0d3517"
        )
        self.transcriber = None

        self.full_transcript = [
            {"role":"system","content":"You are a large language model called llama 3 creeated by meta, answer the questions asked by the user"}
        ]
##### Real-Time Transcription with AAI

    def on_open(self,session_opened: aai.RealtimeSessionOpened):
        #print("Session ID:", session_opened.session_id)
        return


    def on_data(self,transcript: aai.RealtimeTranscript):
        if not transcript.text:
            return

        if isinstance(transcript, aai.RealtimeFinalTranscript):
            print(transcript.text)
            self.generate_ai_response(transcript)
        else:
            print(transcript.text, end="\r")


    def on_error(self,error: aai.RealtimeError):
        #print("An error occured:", error)
        return


    def on_close(self):
        #print("Closing Session")
        return
    def start_transcription(self):

        self.transcriber = aai.RealtimeTranscriber(
            sample_rate=16_000,
            on_data=self.on_data,
            on_error=self.on_error,
            on_open=self.on_open,
            on_close=self.on_close,
        )

        self.transcriber.connect()

        microphone_stream = aai.extras.MicrophoneStream(sample_rate=16_000)
        self.transcriber.stream(microphone_stream)
    def close_transcription(self):
        if self.transcriber:
            self.transcriber.close()
            self.transcriber = None

###### Pass real-time transcript to LLAMA 3
    def generate_ai_response(self,transcript):
        self.close_transcription()

        self.full_transcript.append({"role":"user","content":transcript.text})
        print(f"\nUser:{transcript.text}",end = "\r\n")
        ollama_stream = ollama.chat(
            model="llama3",
            messages=self.full_transcript,
            stream=True,
        )

        print("LLama 3:", end = "\r\n")

        text_buffer = ""
        full_text = ""
        for chunk in ollama_stream:
            text_buffer += chunk['messages']['content']
            if text_buffer.endswith('.'):
                audio_stream = self.client.generate(text=text_buffer,
                                                    model="eleven_turbo_v2",
                                                    stream=True)
                print(text_buffer,end="\n", flush = True)
                stream(audio_stream)
                full_text += text_buffer
                text_buffer = ""
        if text_buffer:
            audio_stream = self.client.generate(text=text_buffer,
                                                    model="eleven_turbo_v2",
                                                    stream=True)
            print(text_buffer,end="\n", flush = True)
            stream(audio_stream)
            full_text += text_buffer
        self.full_transcript.append({"role":"assistant","content":full_text})

        self.start_transcription()

ai_Assistant = AI_Assistant()
ai_Assistant.start_transcription()

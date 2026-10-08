class VoiceService:
    """Provider-neutral voice boundary. Connect STT/TTS provider implementations here later."""
    def speech_to_text(self, audio):
        raise NotImplementedError('Connect a speech-to-text provider here')

    def generate_response(self, text: str, context: str) -> dict:
        return {'text': 'I can help confirm your verified medication. Please say yes or no.', 'safe': True}

    def text_to_speech(self, text: str):
        raise NotImplementedError('Connect a text-to-speech provider here')

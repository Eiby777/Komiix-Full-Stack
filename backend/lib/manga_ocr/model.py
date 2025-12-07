import onnxruntime as ort
import numpy as np
from typing import List
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class MangaOCRModel:
    """ONNX-based Manga OCR model"""

    def __init__(self, config):
        self.config = config
        self.encoder_session = None
        self.decoder_session = None
        self.vocab = None
        self._load_model()

    def _load_model(self):
        """Load ONNX models and vocabulary"""
        self.encoder_session = ort.InferenceSession(self.config.encoder_path)
        self.decoder_session = ort.InferenceSession(self.config.decoder_path)

        with open(self.config.vocab_path, 'r', encoding='utf-8') as f:
            self.vocab = f.read().splitlines()

    def generate_tokens(self, encoder_hidden_states: np.ndarray) -> List[int]:
        """Generate token sequence using greedy decoding"""
        current_token = np.array([[self.config.decoder_start_token_id]], dtype=np.int64)
        generated_tokens = [self.config.decoder_start_token_id]

        for _ in range(self.config.max_length):
            decoder_outputs = self.decoder_session.run(None, {
                "input_ids": current_token,
                "encoder_hidden_states": encoder_hidden_states
            })

            next_token_logits = decoder_outputs[0][:, -1, :]
            next_token = np.argmax(next_token_logits, axis=-1)[0]

            if next_token == self.config.eos_token_id:
                break

            generated_tokens.append(int(next_token))
            current_token = np.array([generated_tokens], dtype=np.int64)

        return generated_tokens

    def decode_tokens(self, tokens: List[int]) -> str:
        """Decode tokens to text"""
        decoded_tokens = []
        for token_id in tokens[1:]:  # Skip BOS token
            if token_id < len(self.vocab) and token_id > 4:  # Skip special tokens
                decoded_tokens.append(self.vocab[token_id])

        return ''.join(decoded_tokens)

    def run_encoder(self, pixel_values: np.ndarray) -> np.ndarray:
        """Run encoder inference"""
        outputs = self.encoder_session.run(None, {"pixel_values": pixel_values})
        return outputs[0]  # Return encoder hidden states
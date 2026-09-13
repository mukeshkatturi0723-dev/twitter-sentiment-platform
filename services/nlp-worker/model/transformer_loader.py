import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class TransformerClassifier:
    def __init__(self, model_name: str = "cardiffnlp/twitter-roberta-base-sentiment-latest"):
        self.model_name = model_name
        self.pipeline = None
        self._loaded = False

    def load(self):
        """Lazy load HuggingFace pipeline when needed"""
        if self._loaded:
            return
        try:
            from transformers import pipeline
            self.pipeline = pipeline(
                "sentiment-analysis",
                model=self.model_name,
                tokenizer=self.model_name,
                top_k=None
            )
            self._loaded = True
            logger.info(f"Loaded HuggingFace model: {self.model_name}")
        except Exception as e:
            logger.warning(f"Could not load HuggingFace model ({e}). Will use rule-based fallback.")
            self.pipeline = None
            self._loaded = False

    def predict(self, text: str) -> Optional[Dict[str, Any]]:
        if not self._loaded and self.pipeline is None:
            self.load()

        if self.pipeline:
            try:
                # RoBERTa returns labels: positive, negative, neutral
                outputs = self.pipeline(text[:512])[0]
                # Sort outputs by score descending
                sorted_preds = sorted(outputs, key=lambda x: x["score"], reverse=True)
                top = sorted_preds[0]
                label_map = {
                    "positive": "positive", "label_2": "positive", "pos": "positive",
                    "negative": "negative", "label_0": "negative", "neg": "negative",
                    "neutral": "neutral", "label_1": "neutral", "neu": "neutral"
                }
                sentiment = label_map.get(top["label"].lower(), "neutral")
                return {
                    "sentiment": sentiment,
                    "confidence": round(float(top["score"]), 4),
                    "raw_outputs": outputs
                }
            except Exception as e:
                logger.error(f"Inference error in Transformer: {e}")
                return None
        return None

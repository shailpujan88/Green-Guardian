from ultralytics import YOLO
import os

__all__ = ['model']

model_path = os.path.join(os.path.dirname(__file__), "best.pt")
model = YOLO(model_path)
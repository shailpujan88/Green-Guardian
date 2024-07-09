from ultralytics import YOLO

__all__ = ['model']

model = YOLO("./best.pt")
from ultralytics.engine.results import Results
from ultralytics import YOLO
from io import BytesIO
import numpy as np
import requests
import sys
import cv2
from typing import List

__all__ = ["predict_image"]

if sys.version_info >= (3, 9):
    # ? Only available in python 3.9 and above
    from functools import cache as caching
else:
    from functools import lru_cache as caching


@caching
def predict_image(
    image_url: str, model_path: str, isRemote: bool = True
) -> List[str] | None:
    """Predict image using YOLO model.

    Args:
        image_url (str): PATH to the image (local or remote).
        model_path (str): PATH to the YOLO model.
        isRemote (bool, optional): Set to True if the image_path is remote url otherwise False. Defaults to True.
    """
    model: YOLO = YOLO(model_path)

    def extract_class(results: List[Results]) -> List[str]:
        """Extract Categorization Classname from the given result set

        Args:
            results (List[Results]): Result from the YOLO model

        Returns:
            List[str]: List of classes that the image falls under.
        """
        classes: List[str] = []

        for info in results:
            boxes = info.boxes

            if not boxes:
                continue

            temp_cls: List[int] = []
            for box_cls in boxes.cls:
                box_cls = int(box_cls)
                if not box_cls in temp_cls:
                    temp_cls.append(box_cls)
            for box_id in temp_cls:
                _class = info.names.get(box_id, None)
                if _class:
                    classes.append(_class)

        return classes or None

    if not isRemote:
        frame = cv2.imread()
        results = model(frame)
        return extract_class(results)

    response = requests.get(image_url)

    if response.status_code != 200:
        print(f"NotFound: Image '{image_url}' is not found")
        return

    image_data = BytesIO(response.content)
    image_np: np.NDArray[np.uint8] = np.asarray(
        bytearray(image_data.read()), dtype=np.uint8
    )

    frame = cv2.imdecode(image_np, -1)
    results = model(frame)

    return extract_class(results)


if __name__ == "__main__":
    image_url = "https://c4.wallpaperflare.com/wallpaper/664/373/122/forest-mikael-gustafsson-landscape-horizon-wallpaper-preview.jpg"
    models = "../models/fire.pt"

    output = predict_image(image_url, models, True)
    print(output)

from typing import Set

__all__ = ["ALLOWED_EXTENSIONS", "isFileAllowed"]

ALLOWED_EXTENSIONS: Set[str] = {
    "jpeg",
    "jpg",
    "png",
    "svg",
    "webp",
    "gif",
    "bmp",
    "ico",
}


def isFileAllowed(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

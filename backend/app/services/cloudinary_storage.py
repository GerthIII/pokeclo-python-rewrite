from typing import BinaryIO

import cloudinary  # type: ignore
import cloudinary.exceptions  # type: ignore
import cloudinary.uploader  # type: ignore

from app.config import settings


class PhotoUploadError(Exception):
    """There was an error uploading your photo"""

cloudinary.config( # type: ignore
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret.get_secret_value()
)

def upload_photo(image: BinaryIO) -> str:
    try:
        response = cloudinary.uploader.upload( # type: ignore
            image, 
            asset_folder = "Pokeclo New",
            timeout = 30
        )
    except cloudinary.exceptions.Error as err:
        raise PhotoUploadError("Could not upload your photo") from err
    return response["public_id"]
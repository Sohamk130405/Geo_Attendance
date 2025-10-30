import cv2
import numpy as np
from PIL import ImageEnhance, Image

def enhance_contrast(image):
    """Optional: Apply grayscale + contrast enhancement."""
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    pil_image = Image.fromarray(gray_image)
    enhancer = ImageEnhance.Contrast(pil_image)
    enhanced_image = enhancer.enhance(1.5)
    return np.array(enhanced_image)

import re

def nicename(value):
    return re.sub('[^a-zA-Z0-9\n\.]', '_', value)
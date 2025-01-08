import re
from operator import truediv

import requests


def askForStatus(message):
    URL = "http://100.75.172.46:4444/v1/chat/completions"
    headers = {"Content-Type": "application/json"}

    data = {
        "model": "llama-3.2-3b-instruct",
        "messages": [
            {
                "role": "user",
                "content": "Give an opinion about health status only in one word. "
                "Options: Good, Bad, Very Bad, Excellent, Dangerous, Dead. "
                "Parameters: avg_temperature: 36.58, min_temperature: 36.5, max_temperature: 36.7, "
                "avg_heart_rate: 72.4, min_heart_rate: 71, max_heart_rate: 73, "
                "avg_oxygen_saturation: 98, min_oxygen_saturation: 98, max_oxygen_saturation: 98."
                "JUST THE STATUS!!!",
            }
        ],
        "temperature": 0.8,
        "max_tokens": 100,
    }
    response = requests.post(URL, headers=headers, json=data)

    if response.status_code == 200:
        content = response.json()
        content = content["choices"][0]
        message = content["message"]["content"]
        return message
    else:
        return "UNKNOWN"


def helperResponse(vitals):
    message = (
        f"Give an opinion about health status only in one word. "
        f"Options: Good, Bad, Very Bad, Excellent, Dangerous, Dead. "
        f"Parameters: avg_temperature: {vitals['avg_temperature']}, min_temperature: {vitals['min_temperature']}, "
        f"max_temperature: {vitals['max_temperature']}, avg_heart_rate: {vitals['avg_heart_rate']}, "
        f"min_heart_rate: {vitals['min_heart_rate']}, max_heart_rate: {vitals['max_heart_rate']}, "
        f"avg_oxygen_saturation: {vitals['avg_oxygen_saturation']}, min_oxygen_saturation: {vitals['min_oxygen_saturation']}, "
        f"max_oxygen_saturation: {vitals['max_oxygen_saturation']}."
        f"ONLY ONE WORD"
    )
    response = askForStatus(message)
    if response in ["Good", "Bad", "Very Bad", "Excellent", "Dangerous", "Dead"]:
        return [True, response]
    return False

import re
from operator import truediv

import requests
def askForStatus(message):
    url = "http://100.75.172.46:4444/v1/chat/completions"
    headers = {
        "Content-Type": "application/json"
    }

    data = {
        "model": "llama-3.2-3b-instruct",
        "messages": message,
        "temperature": 0.8,
        "max_tokens": 100
    }
    response = requests.post(url, headers=headers, json=data)

    # Print the response
    if response.status_code == 200:
        # Extract the health status word from the response
        content = response.json()
        content=content["choices"][0]
        message = content["message"]["content"]
        return message
    else:
       return "UNKNOWN"
def helperResponse(vitals):
    message = [
            {
                "role": "user",
            "content": (
                f"Give an opinion about health status only in one word. "
                f"Options:Good,Bad,Very Bad,Excellent,Dangerous,Dead,Critical,Normal"
                f"Parameters: avg_temperature: {vitals['avg_temperature']}, min_temperature: {vitals['min_temperature']}, "
                f"max_temperature: {vitals['max_temperature']}, avg_heart_rate: {vitals['avg_heart_rate']}, "
                f"min_heart_rate: {vitals['min_heart_rate']}, max_heart_rate: {vitals['max_heart_rate']}, "
                f"avg_oxygen_saturation: {vitals['avg_oxygen_saturation']}, min_oxygen_saturation: {vitals['min_oxygen_saturation']}, "
                f"max_oxygen_saturation: {vitals['max_oxygen_saturation']}. ONLY ONE WORD"
            )
            }
        ]
    response = askForStatus(message)
    if (response in ["Good", "Bad", "Very Bad", "Excellent", "Dangerous", "Dead","Critical","Normal"]):
        return [True,response]
    return False



import requests
def askForOpinion(message):
    url = "http://100.75.172.46:4444/v1/chat/completions"
    headers = {
        "Content-Type": "application/json"
    }

    data = {
        "model": "llama-3.2-3b-instruct",
        "messages": message,
        "temperature": 0.8,
        "max_tokens": 300
    }
    response = requests.post(url, headers=headers, json=data)

    # Print the response
    if response.status_code == 200:
        # Extract the health status word from the response
        content = response.json()
        content=content["choices"][0]
        message = content["message"]["content"]
        return message
    else:
       return "UNKNOWN"
def helperResponseOpinion(vitals):
    message = [
            {
                "role": "user",
            "content": (
                f"Give an opinion about health status. "
                f"Parameters: avg_temperature: {vitals['avg_temperature']}, min_temperature: {vitals['min_temperature']}, "
                f"max_temperature: {vitals['max_temperature']}, avg_heart_rate: {vitals['avg_heart_rate']}, "
                f"min_heart_rate: {vitals['min_heart_rate']}, max_heart_rate: {vitals['max_heart_rate']}, "
                f"avg_oxygen_saturation: {vitals['avg_oxygen_saturation']}, min_oxygen_saturation: {vitals['min_oxygen_saturation']}, "
                f"max_oxygen_saturation: {vitals['max_oxygen_saturation']}. 3 or 4 SENTENCES"
            )
            }
        ]
    response = askForOpinion(message)
    return [True,response]

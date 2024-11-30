import requests
url = "http://localhost:4444/v1/chat/completions"
data = {
    "model": "llama-3.2-3b-instruct",
    "messages": [
        {
            "role": "user",
            "content": "If we work in a team,me 2 girls and another boy.Every one of us gets 4 dollars.How much are we paid as a team?Just the result."
        }
    ],
    "temperature": 0.7,
    "max_tokens": 100
}
response = requests.post(url, json=data)

# Print the response
if response.status_code == 200:
    print("Response:", response.json())
else:
    print("Failed with status code:", response.status_code)
    print("Error:", response.text)
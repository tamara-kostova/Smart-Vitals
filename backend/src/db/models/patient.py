from datetime import datetime

from pydantic import BaseModel


class Patient(BaseModel):
    name: str
    surname: str
    gender: str
    date_of_birth: datetime
    age: int
    embg: str
    active: bool = True
    deleted: bool = False

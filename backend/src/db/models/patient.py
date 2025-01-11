from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Patient(BaseModel):
    id: Optional[int] = None
    name: str
    surname: str
    gender: str
    date_of_birth: datetime
    age: int
    embg: str
    active: bool = True
    deleted: bool = False

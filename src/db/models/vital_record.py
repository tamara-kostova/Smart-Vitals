from datetime import datetime

from pydantic import BaseModel


class VitalsRecord(BaseModel):
    temperature: float
    heart_rate: int
    blood_pressure_systolic: int
    blood_pressure_diastolic: int
    oxygen_saturation: int
    timestamp: datetime

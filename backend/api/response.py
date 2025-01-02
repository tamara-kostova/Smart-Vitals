from src.db.models.patient import Patient
from src.db.models.vital_record import VitalsRecord


class VitalsRecordResponse(VitalsRecord):
    id: int
    patient_id: int


class PatientResponse(Patient):
    id: int

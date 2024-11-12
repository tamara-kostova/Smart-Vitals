from fastapi import Request
from src.db.repository.patients_repository import PatientRepository
from src.db.repository.vital_records_repository import VitalsRepository


def get_patients_repo(request: Request) -> PatientRepository:
    return request.app.state.patients_repo


def get_vitals_repo(request: Request) -> VitalsRepository:
    return request.app.state.vitals_repo

from datetime import datetime
from fastapi import APIRouter, Depends

from api.deps import get_vitals_repo
from src.db.repository.vital_records_repository import VitalsRepository
from src.db.models.vital_record import VitalsRecord

router = APIRouter()


@router.get("/")
def home():
    return {"message": "Welcome to Patient Monitoring System"}


@router.post("/patients/{patient_id}/vitals/")
async def create_vitals(
    patient_id: int,
    vitals: VitalsRecord,
    vitals_repo: VitalsRepository = Depends(get_vitals_repo),
):
    return await vitals_repo.insert(patient_id, vitals, return_insert_value=True)


@router.get("/patients/{patient_id}/vitals/stats")
async def get_patient_stats(
    patient_id: int,
    from_date: datetime,
    to_date: datetime,
    vitals_repo: VitalsRepository = Depends(get_vitals_repo),
):
    return await vitals_repo.get_patient_vitals_stats(patient_id, from_date, to_date)

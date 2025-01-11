from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path

from services import llamaRequestFormat
from api.deps import get_patients_repo, get_vitals_repo
from services.manualStatus import findHealthStatusBackup
from src.db.models.patient import Patient
from src.db.models.vital_record import VitalsRecord
from src.db.repository.patients_repository import PatientRepository
from src.db.repository.vital_records_repository import VitalsRepository

router = APIRouter()


@router.get("/")
def home():
    return {"message": "Welcome to Patient Monitoring System"}


@router.get("/patients/general/")
async def all_patients(patients_repo: PatientRepository = Depends(get_patients_repo)):
    return await patients_repo.fetch()


@router.get("/patients/{patient_id}/general/")
async def all_patients(
    patient_id: int, patients_repo: PatientRepository = Depends(get_patients_repo)
):
    patient_db_record = await patients_repo.fetch(patient_id)
    if len(patient_db_record) == 0:
        return None
    return patient_db_record[0]


@router.get("/patients/{patient_embg}/patient_details")
async def patient_by_embg(
    patient_embg: str, patients_repo: PatientRepository = Depends(get_patients_repo)
):
    patient_db_record = await patients_repo.fetch(patient_embg)
    if len(patient_db_record) == 0:
        return None
    return patient_db_record[0]


@router.post("/patients/store/")
async def store_patients(
    patient: Patient, patients_repo: PatientRepository = Depends(get_patients_repo)
):
    try:
        patient_id = await patients_repo.insert(patient, return_insert_value=True)
        return {"message": "Patient created successfully", "patient_id": patient_id}
    except Exception as e:
        # Handle any errors (e.g., database issues, invalid data)
        raise HTTPException(status_code=500, detail=f"Error creating patient: {e}")


@router.get("/patients/{patient_id}/edit/")
async def edit_patient(
    patient_id: int, patients_repo: PatientRepository = Depends(get_patients_repo)
):
    patient_db_record = await patients_repo.fetch(patient_id)
    if len(patient_db_record) == 0:
        return None
    return patient_db_record[0]


@router.post("/patients/{patient_id}/edit/")
async def edit_patient(
    patient_id: int,
    updated_patient: Patient,
    patients_repo: PatientRepository = Depends(get_patients_repo),
):
    try:
        result = await patients_repo.update(patient_id, updated_patient)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating patient: {e}")


@router.post("/patients/{patient_id}/delete/")
async def delete_patients(
    # soft delete e ova
    patient_id: int,
    patients_repo: PatientRepository = Depends(get_patients_repo),
):
    try:
        result = await patients_repo.delete(patient_id)

        if result:
            return {"message": "Patient deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting patient: {e}")


@router.post("/patients/{patient_id}/activate/")
async def activate_patient(
    patient_id: int,
    patients_repo: PatientRepository = Depends(get_patients_repo),
):
    try:
        await patients_repo.activate(patient_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error activating patient: {e}")


@router.post("/patients/{patient_id}/deactivate/")
async def activate_patient(
    patient_id: int,
    patients_repo: PatientRepository = Depends(get_patients_repo),
):
    try:
        await patients_repo.deactivate(patient_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error activating patient: {e}")


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
    from_date: Optional[datetime] = Query(
        None, description="Start date for the stats (ISO 8601 format)"
    ),
    to_date: Optional[datetime] = Query(
        None, description="End date for the stats (ISO 8601 format)"
    ),
    vitals_repo: VitalsRepository = Depends(get_vitals_repo),
):
    if from_date is None:
        from_date = datetime.now() - timedelta(minutes=5)
    if to_date is None:
        to_date = datetime.now()
    return await vitals_repo.get_patient_vitals_stats(patient_id, from_date, to_date)


@router.get("/patients/{patient_id}/status")
async def get_patient_stats(
    patient_id: int,
    from_date: Optional[datetime] = Query(
        None, description="Start date for the stats (ISO 8601 format)"
    ),
    to_date: Optional[datetime] = Query(
        None, description="End date for the stats (ISO 8601 format)"
    ),
    vitals_repo: VitalsRepository = Depends(get_vitals_repo),
):
    if from_date is None:
        from_date = datetime.now() - timedelta(minutes=5)
    if to_date is None:
        to_date = datetime.now()
    vitals = await vitals_repo.get_patient_vitals_stats(patient_id, from_date, to_date)

    cnt = 0
    while cnt < 3:
        result = llamaRequestFormat.helperResponse(vitals)

        if result:
            return result[1]
        cnt += 1
    return findHealthStatusBackup(vitals)


@router.get("/patients/{patient_id}/opinion")
async def get_patient_stats(
    patient_id: int,
    from_date: Optional[datetime] = Query(
        None, description="Start date for the stats (ISO 8601 format)"
    ),
    to_date: Optional[datetime] = Query(
        None, description="End date for the stats (ISO 8601 format)"
    ),
    vitals_repo: VitalsRepository = Depends(get_vitals_repo),
):

    if from_date is None:
        from_date = datetime.now() - timedelta(minutes=5)
    if to_date is None:
        to_date = datetime.now()
    vitals = await vitals_repo.get_patient_vitals_stats(patient_id, from_date, to_date)

    result = llamaRequestFormat.helperResponseOpinion(vitals)

    return result[1]


@router.get("/patients/{patient_id}/vitals/temperature")
async def get_patient_temperature(
    patient_id: int,
    vitals_repo: VitalsRepository = Depends(get_vitals_repo),
):
    try:
        vitals = await vitals_repo.get_patient_temperature(patient_id)
        if not vitals:
            raise HTTPException(
                status_code=404, detail="No records found for temperature"
            )
        return vitals
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching temperatures: {e}")


@router.get("/patients/{patient_id}/vitals/saturation")
async def get_patient_saturation(
    patient_id: int,
    vitals_repo: VitalsRepository = Depends(get_vitals_repo),
):
    try:
        vitals = await vitals_repo.get_patient_saturation(patient_id)
        if not vitals:
            raise HTTPException(
                status_code=404, detail="No records found for saturation"
            )
        return vitals
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching saturation: {e}")


@router.get("/patients/{patient_id}/vitals/heartrate")
async def get_patient_heart_rate(
    patient_id: int,
    vitals_repo: VitalsRepository = Depends(get_vitals_repo),
):
    try:
        vitals = await vitals_repo.get_patient_heart_rate(patient_id)
        if not vitals:
            raise HTTPException(
                status_code=404, detail="No records found for heart rate"
            )
        return vitals
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching heart rates: {e}")


@router.get("/patients/{patient_id}/vitals/systolic")
async def get_patient_systolic_pressure(
    patient_id: int,
    vitals_repo: VitalsRepository = Depends(get_vitals_repo),
):
    try:
        vitals = await vitals_repo.get_patient_systolic_pressure(patient_id)
        if not vitals:
            raise HTTPException(
                status_code=404, detail="No records found for systolic pressure"
            )
        return vitals
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching systolic: {e}")


@router.get("/patients/{patient_id}/vitals/diastolic")
async def get_patient_diastolic_pressure(
    patient_id: int,
    vitals_repo: VitalsRepository = Depends(get_vitals_repo),
):
    try:
        vitals = await vitals_repo.get_patient_diastolic_pressure(patient_id)
        if not vitals:
            raise HTTPException(
                status_code=404, detail="No records found for diastolic pressure"
            )
        return vitals
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching diastolic: {e}")

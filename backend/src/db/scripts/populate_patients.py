import asyncio
import logging
from datetime import date, datetime

from faker import Faker

from src.db.models.db_connection import TimescaleDBClient
from src.db.models.patient import Patient
from src.db.repository.patients_repository import PatientRepository

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

faker = Faker()


async def generate_patients(num_patients: int):
    patients = []
    for _ in range(num_patients):
        gender = faker.random_element(["Male", "Female"])
        dob = faker.date_of_birth(minimum_age=5, maximum_age=80)
        patient = Patient(
            id=0, # placeholder
            name=(
                faker.first_name_male()
                if gender == "Male"
                else faker.first_name_female()
            ),
            surname=faker.last_name(),
            gender=gender,
            date_of_birth=dob,
            age=(datetime.now().year - dob.year),
            embg=faker.unique.numerify("#############"),
            active=True,
            deleted=False,
            created_at=datetime.utcnow(),
        )
        patients.append(patient)
    return patients


async def populate_patients_if_empty(patients_repo: PatientRepository):
    existing_patients = await patients_repo.fetch()
    if len(existing_patients) == 0:
        print("No records found in patients table. Populating with sample data...")

        sample_patients = await generate_patients(50)

        for patient in sample_patients:
            await patients_repo.insert(patient)
        logger.info("Sample data inserted successfully.")
    else:
        logger.info("Patients table not empty. Skipping initialization.")

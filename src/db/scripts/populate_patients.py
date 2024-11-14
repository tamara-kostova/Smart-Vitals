import asyncio
import logging
from datetime import date, datetime

from src.db.models.db_connection import TimescaleDBClient
from src.db.models.patient import Patient
from src.db.repository.patients_repository import PatientRepository

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def populate_patients_if_empty(patients_repo: PatientRepository):
    existing_patients = await patients_repo.fetch()
    if len(existing_patients) == 0:
        print("No records found in patients table. Populating with sample data...")

        sample_patients = [
            Patient(name="Tamara", surname="Kostova", gender="Female", date_of_birth=date(1980, 1, 1), age=44, embg="1234567890123", active=True, deleted=False, created_at=datetime.utcnow()),
            Patient(name="Aleksandra", surname="Nastoska", gender="Female", date_of_birth=date(1985, 5, 10), age=39, embg="1234567890124", active=True, deleted=False, created_at=datetime.utcnow()),
            Patient(name="Ilija", surname="Bozoski", gender="Male", date_of_birth=date(1990, 2, 15), age=34, embg="1234567890125", active=True, deleted=False, created_at=datetime.utcnow()),
            Patient(name="Boris", surname="Smokovski", gender="Male", date_of_birth=date(1975, 8, 22), age=49, embg="1234567890126", active=True, deleted=False, created_at=datetime.utcnow()),
            Patient(name="Dimitar", surname="Trajanov", gender="Male", date_of_birth=date(2000, 11, 30), age=23, embg="1234567890127", active=True, deleted=False, created_at=datetime.utcnow()),
            Patient(name="Ema", surname="Petreska", gender="Female", date_of_birth=date(1995, 7, 7), age=29, embg="1234567890128", active=True, deleted=False, created_at=datetime.utcnow()),
            Patient(name="Marija", surname="Stefanovska", gender="Female", date_of_birth=date(1998, 4, 25), age=26, embg="1234567890129", active=True, deleted=False, created_at=datetime.utcnow()),
            Patient(name="Ana", surname="Stojanovska", gender="Female", date_of_birth=date(2003, 12, 12), age=20, embg="1234567890130", active=True, deleted=False, created_at=datetime.utcnow()),
            Patient(name="Trajko", surname="Trajkovsi", gender="Male", date_of_birth=date(1992, 6, 19), age=32, embg="1234567890131", active=True, deleted=False, created_at=datetime.utcnow()),
            Patient(name="Petar", surname="Petrovski", gender="Male", date_of_birth=date(1988, 9, 29), age=36, embg="1234567890132", active=True, deleted=False, created_at=datetime.utcnow()),
        ]

        for patient in sample_patients:
            await patients_repo.insert(patient)
        logger.info("Sample data inserted successfully.")
    else:
        logger.info("Patients table not empty. Skipping initialization.")


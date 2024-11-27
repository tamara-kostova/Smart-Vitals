import os
import asyncio
from datetime import datetime, timezone
import random

from src.db.models.vital_record import VitalsRecord
from src.db.models.db_connection import TimescaleDBClient
from src.db.repository.vital_records_repository import VitalsRepository

class VitalRecordSimulator:
    def __init__(self, patient_id: int, age: int):
        self.patient_id = patient_id
        self.age = age
        self.initialize_vitals()

    def initialize_vitals(self):
        self.temperature = random.uniform(36.1, 40.5)
        self.heart_rate = self.simulate_heart_rate()
        self.blood_pressure = self.simulate_blood_pressure()
        self.oxygen_saturation = random.randint(95, 100)

    def update_vitals(self):
        self.temperature += random.gauss(0, 0.1)
        self.heart_rate += random.gauss(0, 2)
        systolic = random.gauss(0, 2)
        diastolic = random.gauss(0, 1)
        self.blood_pressure = (max(80, min(self.blood_pressure[0] + systolic, 200)), max(40, min(self.blood_pressure[1] + diastolic, 120)))
        self.oxygen_saturation += random.gauss(0, 0.5)

    def to_vitals_record(self) -> VitalsRecord:
        return VitalsRecord(
            patient_id=self.patient_id,
            temperature = round(self.temperature, 1),
            heart_rate = round(self.heart_rate),
            blood_pressure_systolic = round(self.blood_pressure[0]),
            blood_pressure_diastolic = round(self.blood_pressure[1]),
            oxygen_saturation = round(self.oxygen_saturation),
            timestamp = datetime.now(timezone.utc),
        )
    def simulate_heart_rate(self):
        if self.age >= 18:
            return random.randint(60, 100)
        elif 12 <= self.age < 18:
            return random.randint(60, 110)
        elif 6 <= self.age < 12:
            return random.randint(70, 120)
        elif 1 <= self.age < 6:
            return random.randint(80, 130)
        else:
            return random.randint(100, 160)

    def simulate_blood_pressure(self):
        if self.age >= 18:
            systolic = random.randint(90, 120)
            diastolic = random.randint(60, 80)
        elif 12 <= self.age < 18:
            systolic = random.randint(90, 120)
            diastolic = random.randint(50, 80)
        else:
            systolic = random.randint(80, 110)
            diastolic = random.randint(50, 70)
        return systolic, diastolic

async def simulate_patient(patient: VitalRecordSimulator, repo: VitalsRepository, stop_event: asyncio.Event):
    while not stop_event.is_set():
        patient.update_vitals()
        vitals_record = patient.to_vitals_record()
        await repo.insert(patient.patient_id, vitals_record)
        print(f"Inserted vitals for patient {patient.patient_id}")
        await asyncio.sleep(60)

async def manage_simulations():
    dsn = os.getenv('DSN')
    db_client = TimescaleDBClient(dsn=dsn)
    vitals_repository = VitalsRepository(db_client)

    patients = {}
    stop_events = {}

    while True:
        active_patients = await db_client.fetchall("SELECT id, age, active FROM patients WHERE active = true")
        active_patient_ids = {p["id"] for p in active_patients}

        for patient_id in list(stop_events.keys()):
            if patient_id not in active_patient_ids:
                stop_events[patient_id].set()
                del stop_events[patient_id]


        for patient in active_patients:
            patient_id = patient["id"]
            if patient_id not in patients:
                simulator = VitalRecordSimulator(patient_id, patient["age"])
                stop_event = asyncio.Event()
                patients[patient_id] = simulator
                stop_events[patient_id] = stop_event
                asyncio.create_task(simulate_patient(simulator, vitals_repository, stop_event))

        await asyncio.sleep(60)

if __name__ == "__main__":
    asyncio.run(manage_simulations())
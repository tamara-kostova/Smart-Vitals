import asyncio
import os
from typing import Dict, Set
from services.scripts.simulate_vitals import VitalRecordSimulator, simulate_patient
from src.db.models.db_connection import TimescaleDBClient
from src.db.repository.vital_records_repository import VitalsRepository

class SimulationManager:
    def __init__(self, db_client: TimescaleDBClient):
        self.db_client = db_client
        self.vitals_repository = VitalsRepository(db_client)
        self.patients: Dict[int, VitalRecordSimulator] = {}
        self.stop_events: Dict[int, asyncio.Event] = {}
        self.main_task: asyncio.Task | None = None

    async def start(self):
        if self.main_task is None:
            self.main_task = asyncio.create_task(self._manage_simulations())
            
    async def stop(self):
        if self.main_task:
            for event in self.stop_events.values():
                event.set()
            self.main_task.cancel()
            try:
                await self.main_task
            except asyncio.CancelledError:
                pass
            self.main_task = None
            self.patients.clear()
            self.stop_events.clear()

    async def _manage_simulations(self):
        while True:
            try:
                active_patients = await self.db_client.fetchall(
                    "SELECT id, age, active FROM patients WHERE active = true"
                )
                active_patient_ids = {p["id"] for p in active_patients}
                
                await self._cleanup_inactive_patients(active_patient_ids)
                
                await self._start_new_patient_simulations(active_patients)
                
                await asyncio.sleep(60)
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Error in simulation management: {e}")
                await asyncio.sleep(5)

    async def _cleanup_inactive_patients(self, active_patient_ids: Set[int]):
        for patient_id in list(self.stop_events.keys()):
            if patient_id not in active_patient_ids:
                self.stop_events[patient_id].set()
                del self.stop_events[patient_id]
                del self.patients[patient_id]

    async def _start_new_patient_simulations(self, active_patients):
        for patient in active_patients:
            patient_id = patient["id"]
            if patient_id not in self.patients:
                simulator = VitalRecordSimulator(patient_id, patient["age"])
                stop_event = asyncio.Event()
                self.patients[patient_id] = simulator
                self.stop_events[patient_id] = stop_event
                asyncio.create_task(
                    simulate_patient(simulator, self.vitals_repository, stop_event)
                )
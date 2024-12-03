from contextlib import asynccontextmanager
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from api import routes
from services.simulation_manager import SimulationManager
from src.db.scripts.populate_patients import populate_patients_if_empty
from services.scripts.simulate_vitals import  simulate_patient, manage_simulations
from src.db.repository.patients_repository import PatientRepository
from src.db.repository.vital_records_repository import VitalsRepository
from src.db.models.db_connection import TimescaleDBClient


@asynccontextmanager
async def lifespan(app: FastAPI):
    dsn = os.getenv('DSN')
    app.state.db_client = TimescaleDBClient(
        dsn=dsn
    )
    app.state.patients_repo = PatientRepository(app.state.db_client)
    await app.state.patients_repo.create_table()
    await populate_patients_if_empty(patients_repo=app.state.patients_repo)
    app.state.vitals_repo = VitalsRepository(app.state.db_client)
    await app.state.vitals_repo.create_table()
    app.state.simulation_manager = SimulationManager(app.state.db_client)
    await app.state.simulation_manager.start()
    
    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(GZipMiddleware, minimum_size=500)
app.include_router(routes.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
    )

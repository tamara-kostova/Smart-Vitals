from datetime import datetime
from typing import List, Optional
from src.db.models.db_connection import TimescaleDBClient
from src.db.models.patient import Patient


class PatientRepository:
    def __init__(self, db_client: TimescaleDBClient) -> None:
        self.db_client = db_client

    async def create_table(self) -> None:
        create_table_query = """
            CREATE TABLE IF NOT EXISTS patients (
                id SERIAL PRIMARY KEY,
                name TEXT,
                surname TEXT,
                gender TEXT,
                date_of_birth DATE,
                age INT,
                embg TEXT,
                active BOOL,
                deleted BOOL,
                created_at DATE
            );
        """
        await self.db_client.create_table(create_table_query)
        
    async def insert(
        self, patient: Patient, return_insert_value: bool = False
    ) -> Optional[int]:
        values = [
            patient.name,
            patient.surname,
            patient.gender,
            patient.date_of_birth,
            patient.age,
            patient.embg,
            patient.active,
            patient.deleted,
            datetime.utcnow(),
        ]

        query = """
            INSERT INTO patients (
                name, surname, gender, date_of_birth, age, 
                embg, active, deleted, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        """

        if return_insert_value:
            query += " RETURNING id;"
            return await self.db_client.insert_and_fetch(query, values)
        else:
            query += ";"
            await self.db_client.insert(query, values)

    async def fetch(
        self,
        id: Optional[int] = None,
        name: Optional[str] = None,
        surname: Optional[str] = None,
        gender: Optional[str] = None,
        embg: Optional[str] = None,
        active: Optional[bool] = None,
    ) -> List[Patient]:
        conditions = []
        values = []
        param_count = 1

        if id is not None:
            conditions.append(f"id = ${param_count}")
            values.append(id)
            param_count += 1
        if name:
            conditions.append(f"name = ${param_count}")
            values.append(name)
            param_count += 1
        if surname:
            conditions.append(f"surname = ${param_count}")
            values.append(surname)
            param_count += 1
        if gender:
            conditions.append(f"gender = ${param_count}")
            values.append(gender)
            param_count += 1
        if embg:
            conditions.append(f"embg = ${param_count}")
            values.append(embg)
            param_count += 1
        if active is not None:
            conditions.append(f"active = ${param_count}")
            values.append(active)
            param_count += 1

        query = "SELECT * FROM patients"
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        query += ";"

        result = await self.db_client.fetchall(query, values)
        return [Patient(**dict(row)) for row in result]

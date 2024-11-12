from datetime import datetime
from typing import List, Optional
from src.db.models.db_connection import TimescaleDBClient
from src.db.models.vital_record import VitalsRecord


class VitalsRepository:
    def __init__(self, db_client: TimescaleDBClient) -> None:
        self.db_client = db_client

    async def create_table(self) -> None:
        create_table_query = """
            CREATE TABLE IF NOT EXISTS vitals (
                id SERIAL PRIMARY KEY,
                patient_id INT,
                temperature FLOAT,
                heart_rate FLOAT,
                blood_pressure_systolic FLOAT,
                blood_pressure_diastolic FLOAT,
                oxygen_saturation INT,
                timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id)
            );
        """
        await self.db_client.create_table(create_table_query)

    async def insert(
        self, patient_id: int, vitals: VitalsRecord, return_insert_value: bool = False
    ) -> Optional[int]:
        values = [
            patient_id,
            vitals.temperature,
            vitals.heart_rate,
            vitals.blood_pressure_systolic,
            vitals.blood_pressure_diastolic,
            vitals.oxygen_saturation,
            vitals.timestamp or datetime.utcnow(),
        ]

        query = """
            INSERT INTO vitals_records (
                patient_id, temperature, heart_rate,
                blood_pressure_systolic, blood_pressure_diastolic,
                oxygen_saturation, timestamp
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        """

        if return_insert_value:
            query += " RETURNING id;"
            return await self.db_client.insert_and_fetch(query, values)
        else:
            query += ";"
            await self.db_client.insert(query, values)

    async def fetch_patient_vitals(
        self,
        patient_id: int,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None,
        limit: int = 100,
    ) -> List[VitalsRecord]:
        conditions = ["patient_id = $1"]
        values = [patient_id]
        param_count = 2

        if from_date:
            conditions.append(f"timestamp >= ${param_count}")
            values.append(from_date)
            param_count += 1
        if to_date:
            conditions.append(f"timestamp <= ${param_count}")
            values.append(to_date)
            param_count += 1

        query = (
            """
            SELECT * FROM vitals_records
            WHERE """
            + " AND ".join(conditions)
            + """
            ORDER BY timestamp DESC
            LIMIT $"""
            + str(param_count)
        )

        values.append(limit)

        result = await self.db_client.fetchall(query, values)
        return [VitalsRecord(**dict(row)) for row in result]

    async def get_patient_vitals_stats(
        self, patient_id: int, from_date: datetime, to_date: datetime
    ):
        query = """
            SELECT 
                avg(temperature) as avg_temperature,
                min(temperature) as min_temperature,
                max(temperature) as max_temperature,
                avg(heart_rate) as avg_heart_rate,
                min(heart_rate) as min_heart_rate,
                max(heart_rate) as max_heart_rate,
                avg(oxygen_saturation) as avg_oxygen_saturation,
                min(oxygen_saturation) as min_oxygen_saturation,
                max(oxygen_saturation) as max_oxygen_saturation
            FROM vitals_records
            WHERE patient_id = $1
                AND timestamp >= $2
                AND timestamp <= $3;
        """

        result = await self.db_client.fetchall(query, [patient_id, from_date, to_date])
        return dict(result[0]) if result else None

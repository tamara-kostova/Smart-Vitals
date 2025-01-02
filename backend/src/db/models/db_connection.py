import logging
from typing import Any, Awaitable, List, Optional, Set

import asyncpg

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TimescaleDBClient:
    def __init__(self, dsn) -> None:
        self.dsn = dsn

    async def initialize_timescale(self) -> None:
        async with asyncpg.create_pool(self.dsn, min_size=1, max_size=10) as pool:
            async with pool.acquire() as connection:
                async with connection.transaction():
                    await connection.execute(
                        "CREATE EXTENSION IF NOT EXISTS timescaledb;"
                    )
                    logger.info("TimescaleDB extension initialized successfully")

    async def create_table(self, query: str) -> None:
        async with asyncpg.create_pool(self.dsn, min_size=1, max_size=10) as pool:
            async with pool.acquire() as connection:
                async with connection.transaction():
                    await connection.execute(query)
                    logger.info("Create table executed successfully.")

    async def insert(self, query: str, values: list[Any]) -> None:
        async with asyncpg.create_pool(self.dsn, min_size=1, max_size=10) as pool:
            async with pool.acquire() as connection:
                async with connection.transaction():
                    await connection.execute(query, *values)
                    logger.info("Insert query executed successfully.")

    async def insert_and_fetch(self, query: str, values: list[Any]) -> Awaitable[Any]:
        async with asyncpg.create_pool(self.dsn, min_size=1, max_size=10) as pool:
            async with pool.acquire() as connection:
                async with connection.transaction():
                    obj = await connection.fetchval(query, *values)
                    logger.info("Insert and fetch executed successfully.")
                    return obj

    async def fetchone(
        self, query: str, values: Optional[List[Any]] = None
    ) -> Optional[Any]:
        async with asyncpg.create_pool(self.dsn, min_size=1, max_size=10) as pool:
            async with pool.acquire() as connection:
                async with connection.transaction():
                    result = await connection.fetchrow(query, *(values or []))
                    logger.info("Fetchone query executed successfully.")
                    return result

    async def fetchall(self, query: str, values: Optional[List[Any]] = None):
        async with asyncpg.create_pool(self.dsn, min_size=1, max_size=10) as pool:
            async with pool.acquire() as connection:
                async with connection.transaction():
                    result = await connection.fetch(query, *(values or []))
                    logger.info("Fetchall query executed successfully.")
        return result

    async def update(self, query: str, values: list[Any]) -> None:
        async with asyncpg.create_pool(self.dsn, min_size=1, max_size=10) as pool:
            async with pool.acquire() as connection:
                async with connection.transaction():
                    await connection.execute(query, *values)
                    logger.info("Update query executed successfully.")

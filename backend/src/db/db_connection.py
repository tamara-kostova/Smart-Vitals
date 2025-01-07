import logging
from typing import Any, Awaitable, List, Optional, Set
import asyncpg

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TimescaleDBClient:
    def __init__(self, dsn) -> None:
        self.dsn = dsn
        self.pool: Optional[asyncpg.Pool] = None

    async def initialize(self) -> None:
        if not self.pool:
            self.pool = await asyncpg.create_pool(
                self.dsn,
                min_size=1,
                max_size=10
            )
            async with self.pool.acquire() as connection:
                async with connection.transaction():
                    await connection.execute("CREATE EXTENSION IF NOT EXISTS timescaledb;")
                    logger.info("TimescaleDB extension initialized successfully")

    async def cleanup(self) -> None:
        if self.pool:
            await self.pool.close()
            self.pool = None
            logger.info("Connection pool closed")

    async def _get_pool(self) -> asyncpg.Pool:
        if not self.pool:
            await self.initialize()
        return self.pool

    async def create_table(self, query: str) -> None:
        pool = await self._get_pool()
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(query)
                logger.info("Create table executed successfully.")

    async def insert(self, query: str, values: list[Any]) -> None:
        pool = await self._get_pool()
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(query, *values)
                logger.info("Insert query executed successfully.")

    async def insert_and_fetch(self, query: str, values: list[Any]) -> Awaitable[Any]:
        pool = await self._get_pool()
        async with pool.acquire() as connection:
            async with connection.transaction():
                obj = await connection.fetchval(query, *values)
                logger.info("Insert and fetch executed successfully.")
                return obj

    async def fetchone(
        self, query: str, values: Optional[List[Any]] = None
    ) -> Optional[Any]:
        pool = await self._get_pool()
        async with pool.acquire() as connection:
            async with connection.transaction():
                result = await connection.fetchrow(query, *(values or []))
                logger.info("Fetchone query executed successfully.")
                return result

    async def fetchall(self, query: str, values: Optional[List[Any]] = None):
        pool = await self._get_pool()
        async with pool.acquire() as connection:
            async with connection.transaction():
                result = await connection.fetch(query, *(values or []))
                logger.info("Fetchall query executed successfully.")
                return result

    async def update(self, query: str, values: list[Any]) -> None:
        pool = await self._get_pool()
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(query, *values)
                logger.info("Update query executed successfully.")
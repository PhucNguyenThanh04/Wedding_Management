
from src.core.database import engine, Base





async def create_all_tables():
    print("Connecting to DB and creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()
    print("Done. Tables created (if not existing).")


# if __name__ == "__main__":
#     asyncio.run(create_all_tables())

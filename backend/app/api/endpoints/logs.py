from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models.log import Log, LogCreate, LogRead
from app.core.db import get_session
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/ingest", response_model=LogRead)
async def ingest_log(log: LogCreate, session: AsyncSession = Depends(get_session)):
    """
    Ingest a new log entry and save to DB.
    """
    db_log = Log.from_orm(log)
    db_log.received_at = datetime.utcnow()
    session.add(db_log)
    await session.commit()
    await session.refresh(db_log)
    return db_log

@router.get("/", response_model=list[LogRead])
async def get_logs(session: AsyncSession = Depends(get_session)):
    """
    Retrieve all logs.
    """
    # In a real app, use pagination!
    from sqlmodel import select
    result = await session.exec(select(Log).limit(100))
    return result.all()

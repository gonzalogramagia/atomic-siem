from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from app.models.alert import Alert, AlertRead, AlertUpdate
from app.core.db import get_session
import uuid

router = APIRouter()

@router.get("/", response_model=list[AlertRead])
async def get_alerts(session: AsyncSession = Depends(get_session)):
    result = await session.exec(select(Alert).order_by(Alert.created_at.desc()))
    return result.all()

@router.get("/{alert_id}", response_model=AlertRead)
async def get_alert(alert_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    alert = await session.get(Alert, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.patch("/{alert_id}", response_model=AlertRead)
async def update_alert(alert_id: uuid.UUID, alert_update: AlertUpdate, session: AsyncSession = Depends(get_session)):
    db_alert = await session.get(Alert, alert_id)
    if not db_alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert_data = alert_update.dict(exclude_unset=True)
    for key, value in alert_data.items():
        setattr(db_alert, key, value)
        
    session.add(db_alert)
    await session.commit()
    await session.refresh(db_alert)
    return db_alert

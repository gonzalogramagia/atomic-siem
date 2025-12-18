from sqlmodel import SQLModel, Field, Column, JSON
from typing import Dict, Any, Optional
from datetime import datetime
import uuid

class LogBase(SQLModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    source: str
    event_type: str
    severity: str = "info"
    payload: Dict[str, Any] = Field(sa_column=Column(JSON))

class Log(LogBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    received_at: datetime = Field(default_factory=datetime.utcnow)

class LogCreate(LogBase):
    pass

class LogRead(LogBase):
    id: uuid.UUID
    received_at: datetime

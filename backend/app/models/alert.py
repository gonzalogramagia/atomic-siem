from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime

class AlertBase(SQLModel):
    rule_id: uuid.UUID = Field(foreign_key="rule.id")
    log_id: uuid.UUID = Field(foreign_key="log.id")
    severity: str
    status: str = "new"  # new, acknowledged, resolved

class Alert(AlertBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AlertRead(AlertBase):
    id: uuid.UUID
    created_at: datetime

class AlertUpdate(SQLModel):
    status: Optional[str] = None

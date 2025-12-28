from sqlmodel import SQLModel, Field, Column, JSON
from typing import Dict, Any, Optional
import uuid
from datetime import datetime

class RuleBase(SQLModel):
    name: str = Field(index=True)
    description: Optional[str] = None
    severity: str = "medium"  # low, medium, high, critical
    logic: Dict[str, Any] = Field(sa_column=Column(JSON))
    enabled: bool = True

class Rule(RuleBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RuleCreate(RuleBase):
    pass

class RuleRead(RuleBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

class RuleUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    logic: Optional[Dict[str, Any]] = None
    enabled: Optional[bool] = None

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from app.models.rule import Rule, RuleCreate, RuleRead, RuleUpdate
from app.core.db import get_session
import uuid

router = APIRouter()

@router.post("/", response_model=RuleRead)
async def create_rule(rule: RuleCreate, session: AsyncSession = Depends(get_session)):
    db_rule = Rule.from_orm(rule)
    session.add(db_rule)
    await session.commit()
    await session.refresh(db_rule)
    return db_rule

@router.get("/", response_model=list[RuleRead])
async def get_rules(session: AsyncSession = Depends(get_session)):
    result = await session.exec(select(Rule))
    return result.all()

@router.get("/{rule_id}", response_model=RuleRead)
async def get_rule(rule_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    rule = await session.get(Rule, rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return rule

@router.patch("/{rule_id}", response_model=RuleRead)
async def update_rule(rule_id: uuid.UUID, rule_update: RuleUpdate, session: AsyncSession = Depends(get_session)):
    db_rule = await session.get(Rule, rule_id)
    if not db_rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    rule_data = rule_update.dict(exclude_unset=True)
    for key, value in rule_data.items():
        setattr(db_rule, key, value)
        
    session.add(db_rule)
    await session.commit()
    await session.refresh(db_rule)
    return db_rule

@router.delete("/{rule_id}")
async def delete_rule(rule_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    rule = await session.get(Rule, rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    await session.delete(rule)
    await session.commit()
    return {"ok": True}

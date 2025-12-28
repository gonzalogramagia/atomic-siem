from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models.log import Log
from app.models.rule import Rule
from app.models.alert import Alert
from app.core.db import engine
from sqlalchemy.orm import sessionmaker

async def evaluate_log(log: Log):
    """
    Evaluate a log against all enabled rules.
    This function is designed to run as a background task.
    """
    # We need a new session for the background task
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # Fetch enabled rules
        statement = select(Rule).where(Rule.enabled == True)
        result = await session.exec(statement)
        rules = result.all()

        for rule in rules:
            if match_rule(log, rule):
                await create_alert(session, log, rule)

def match_rule(log: Log, rule: Rule) -> bool:
    """
    Check if a log matches a rule's logic.
    Logic format: {"field": "event_type", "operator": "eq", "value": "failed_login"}
    """
    logic = rule.logic
    if not logic:
        return False

    field = logic.get("field")
    operator = logic.get("operator")
    value = logic.get("value")

    if not field or not operator or value is None:
        return False

    # Get the value from the log
    # We check top-level fields first, then payload
    log_value = getattr(log, field, None)
    if log_value is None and "payload" in log.dict():
        log_value = log.payload.get(field)

    if log_value is None:
        return False

    if operator == "eq":
        return str(log_value) == str(value)
    elif operator == "contains":
        return str(value) in str(log_value)
    # Add more operators as needed

    return False

async def create_alert(session: AsyncSession, log: Log, rule: Rule):
    """
    Create an alert for a matched rule.
    """
    alert = Alert(
        rule_id=rule.id,
        log_id=log.id,
        severity=rule.severity,
        status="new"
    )
    session.add(alert)
    await session.commit()
    print(f"ALERT CREATED: Rule '{rule.name}' matched Log '{log.id}'")

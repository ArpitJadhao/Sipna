from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.prediction_model import Alert

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("/", response_model=List[Alert])
def get_alerts(
    site_id: str = "SITE-01",
    limit: int = 50,
    session: Session = Depends(get_session),
):
    statement = (
        select(Alert)
        .where(Alert.site_id == site_id)
        .order_by(Alert.id.desc())  # type: ignore
        .limit(limit)
    )
    return session.exec(statement).all()


@router.patch("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, session: Session = Depends(get_session)):
    alert = session.get(Alert, alert_id)
    if alert:
        alert.acknowledged = True
        session.add(alert)
        session.commit()
        session.refresh(alert)
    return alert

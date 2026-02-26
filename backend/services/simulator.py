import asyncio
import random
from datetime import datetime
from sqlmodel import Session

from database import engine
from models.prediction_model import Prediction, Alert
from services.websocket_manager import manager

SITES = ["SITE-01", "SITE-02", "SITE-03", "SITE-04"]

# Weighted statuses — mostly clear/moderate, occasional pollutant
STATUS_WEIGHTS = [("clear", 55), ("moderate", 35), ("pollutant", 10)]


def weighted_status() -> str:
    statuses = [s for s, w in STATUS_WEIGHTS for _ in range(w)]
    return random.choice(statuses)


def simulate_prediction(site_id: str = "SITE-01") -> dict:
    status = weighted_status()

    if status == "clear":
        turbidity = round(random.uniform(0.5, 4.0), 2)
        ph = round(random.uniform(6.8, 7.5), 2)
        confidence = round(random.uniform(88, 99), 1)
        compliance = round(random.uniform(92, 100), 1)
    elif status == "moderate":
        turbidity = round(random.uniform(4.0, 25.0), 2)
        ph = round(random.uniform(6.0, 8.5), 2)
        confidence = round(random.uniform(75, 92), 1)
        compliance = round(random.uniform(65, 90), 1)
    else:  # pollutant
        turbidity = round(random.uniform(25.0, 120.0), 2)
        ph = round(random.uniform(4.0, 10.5), 2)
        confidence = round(random.uniform(82, 97), 1)
        compliance = round(random.uniform(10, 55), 1)

    return {
        "timestamp": datetime.utcnow().isoformat(),
        "status": status,
        "confidence": confidence,
        "turbidity": turbidity,
        "ph": ph,
        "compliance_score": compliance,
        "site_id": site_id,
    }


async def run_simulator():
    """Background task: emit a prediction every 2 seconds for the primary site."""
    while True:
        data = simulate_prediction("SITE-01")

        # Persist to PostgreSQL
        pred = Prediction(**data, timestamp=datetime.fromisoformat(data["timestamp"]))
        with Session(engine) as session:
            session.add(pred)

            # Auto-generate alert for pollutant events
            if data["status"] == "pollutant":
                alert = Alert(
                    severity="critical",
                    message=f"⚠ Pollutant detected! Turbidity={data['turbidity']} NTU, pH={data['ph']}",
                    site_id=data["site_id"],
                )
                session.add(alert)
            elif data["status"] == "moderate" and data["turbidity"] > 15:
                alert = Alert(
                    severity="warning",
                    message=f"Elevated turbidity {data['turbidity']} NTU at {data['site_id']}",
                    site_id=data["site_id"],
                )
                session.add(alert)

            session.commit()

        # Broadcast over WebSocket
        await manager.broadcast({"type": "prediction", "data": data})
        await asyncio.sleep(2)

from fastapi import APIRouter
from services.pairing_manager import pairing_manager

router = APIRouter(prefix="/api/pair", tags=["Pairing"])

@router.post("/create-session")
def create_session():
    """Generates a UUID session strictly used for QR Mobile auto-pairing."""
    session_id = pairing_manager.create_session()
    return {"session_id": session_id}

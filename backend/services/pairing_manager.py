import uuid
import time
from typing import Dict, Optional
import asyncio

class PairingManager:
    def __init__(self):
        # Format: { "session_id": { "status": "waiting" | "connected", "created_at": float } }
        self.sessions: Dict[str, dict] = {}
        # We start the cleanup loop to nuke old sessions every 60s
        asyncio.create_task(self._cleanup_loop())

    def create_session(self) -> str:
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "status": "waiting",
            "created_at": time.time()
        }
        return session_id

    def validate_and_connect(self, session_id: str) -> bool:
        session = self.sessions.get(session_id)
        if not session:
            return False
            
        if session["status"] == "waiting":
            session["status"] = "connected"
            return True
            
        return False

    def is_connected(self, session_id: str) -> bool:
        session = self.sessions.get(session_id)
        if not session:
            return False
        return session["status"] == "connected"

    async def _cleanup_loop(self):
        while True:
            await asyncio.sleep(60)
            now = time.time()
            expired = []
            
            for s_id, data in self.sessions.items():
                # Expire after 5 minutes (300 seconds)
                if now - data["created_at"] > 300:
                    expired.append(s_id)
                    
            for s_id in expired:
                del self.sessions[s_id]


pairing_manager = PairingManager()

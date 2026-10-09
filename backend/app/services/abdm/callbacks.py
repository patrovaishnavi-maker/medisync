"""
ABDM Callback Registry & Asynchronous Event Correlator
Receives, verifies, and matches incoming NHA Gateway webhooks with internal transaction IDs.
"""

import datetime
import logging
from typing import Dict, Any, Optional
from .exceptions import ABDMCallbackMismatchError

logger = logging.getLogger("medisync.abdm.callbacks")

# Store correlation IDs and their pending futures / handlers
CALLBACK_CORRELATION_MAP: Dict[str, Dict[str, Any]] = {}
PROCESSED_CALLBACK_LOGS: list = []


class ABDMCallbackManager:
    """Manages asynchronous webhook notifications from the ABDM Gateway"""

    def register_pending_request(self, request_id: str, context_data: Dict[str, Any]):
        """Registers a pending request ID expecting an asynchronous callback"""
        CALLBACK_CORRELATION_MAP[request_id] = {
            "context": context_data,
            "registered_at": datetime.datetime.now(datetime.timezone.utc),
            "status": "AWAITING_CALLBACK"
        }

    async def handle_incoming_callback(self, event_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes callbacks such as /v0.5/users/auth/on-init, /v0.5/links/link/on-init,
        /v0.5/consent-requests/on-init, etc.
        """
        resp_block = payload.get("resp", {})
        request_id = resp_block.get("requestId") or payload.get("requestId")

        logger.info(f"Processing ABDM asynchronous callback [{event_type}] for Request ID: {request_id}")

        correlation = CALLBACK_CORRELATION_MAP.get(request_id)
        is_correlated = correlation is not None

        event_record = {
            "event_type": event_type,
            "request_id": request_id,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "has_error": "error" in payload and payload["error"] is not None,
            "is_correlated": is_correlated,
            "error": payload.get("error")
        }
        PROCESSED_CALLBACK_LOGS.append(event_record)

        if correlation:
            correlation["status"] = "CALLBACK_RECEIVED"
            correlation["received_at"] = datetime.datetime.now(datetime.timezone.utc)
            correlation["result"] = payload

        return {
            "status": "PROCESSED",
            "request_id": request_id,
            "correlated": is_correlated
        }

    def get_recent_callbacks(self, limit: int = 10) -> list:
        return PROCESSED_CALLBACK_LOGS[-limit:]


callback_manager = ABDMCallbackManager()

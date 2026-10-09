"""
ABDM Session & Gateway Authentication Handler
Manages session token lifecycle, automatic renewal, and secure server-side storage.
"""

import time
import httpx
import logging
from typing import Optional, Tuple
from .config import abdm_settings
from .exceptions import ABDMAuthenticationError

logger = logging.getLogger("medisync.abdm.auth")


class ABDMAuthManager:
    def __init__(self):
        self._cached_token: Optional[str] = None
        self._token_expires_at: float = 0.0
        self._is_mock: bool = False

    async def get_valid_token(self) -> Tuple[str, bool]:
        """
        Returns (access_token, is_mock).
        Refreshes token if expired or about to expire in under 60 seconds.
        """
        current_time = time.time()
        if self._cached_token and current_time < (self._token_expires_at - 60):
            return self._cached_token, self._is_mock

        # Attempt to authenticate with official NHA Gateway
        try:
            async with httpx.AsyncClient(timeout=abdm_settings.ABDM_REQUEST_TIMEOUT_SECONDS) as client:
                payload = {
                    "clientId": abdm_settings.ABDM_CLIENT_ID,
                    "clientSecret": abdm_settings.ABDM_CLIENT_SECRET,
                }
                url = f"{abdm_settings.ABDM_BASE_URL}/v0.5/sessions"
                response = await client.post(url, json=payload)

                if response.status_code == 200:
                    data = response.json()
                    access_token = data.get("accessToken")
                    expires_in = data.get("expiresIn", 1800)
                    self._cached_token = access_token
                    self._token_expires_at = current_time + expires_in
                    self._is_mock = False
                    logger.info("Successfully refreshed ABDM Gateway Session token from NHA upstream.")
                    return access_token, False
                else:
                    logger.warning(
                        f"ABDM Gateway rejected session creation (HTTP {response.status_code}): {response.text}"
                    )
        except Exception as ex:
            logger.warning(f"Unable to reach live ABDM Gateway ({ex}). Checking mock fallback configuration.")

        # If live gateway is not reachable and mock fallback is enabled
        if abdm_settings.ABDM_MOCK_FALLBACK_ENABLED:
            logger.info("Using authorized Sandbox Simulation Token (NHA dev mock mode active).")
            self._cached_token = "SBX_SIMULATION_TOKEN_" + str(int(current_time))
            self._token_expires_at = current_time + 3600
            self._is_mock = True
            return self._cached_token, True

        raise ABDMAuthenticationError(
            "ABDM Gateway authentication failed and mock fallback is disabled. Please verify credentials."
        )


auth_manager = ABDMAuthManager()

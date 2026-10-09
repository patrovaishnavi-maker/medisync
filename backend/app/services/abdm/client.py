"""
ABDM Base Client Layer
Enforces standard NHA Gateway headers, correlation IDs, and secure transmission.
"""

import uuid
import datetime
import logging
import httpx
from typing import Dict, Any, Tuple
from .config import abdm_settings
from .auth import auth_manager
from .exceptions import ABDMException, ABDMTimeoutError, ABDMAuthenticationError

logger = logging.getLogger("medisync.abdm.client")


class ABDMClient:
    def __init__(self):
        self.base_url = abdm_settings.ABDM_BASE_URL.rstrip("/")

    async def _build_headers(self, custom_request_id: str = None) -> Tuple[Dict[str, str], bool]:
        token, is_mock = await auth_manager.get_valid_token()
        req_id = custom_request_id or str(uuid.uuid4())
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
            "X-CM-ID": "sbx",
            "REQUEST-ID": req_id,
            "TIMESTAMP": timestamp,
        }
        return headers, is_mock

    async def post(self, endpoint: str, payload: Dict[str, Any], request_id: str = None) -> Tuple[Dict[str, Any], bool]:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers, is_mock = await self._build_headers(request_id)

        if is_mock:
            # When mock token is active, caller service handlers handle simulated responses
            return {}, True

        try:
            async with httpx.AsyncClient(timeout=abdm_settings.ABDM_REQUEST_TIMEOUT_SECONDS) as client:
                logger.info(f"Dispatching ABDM Gateway Request to {url} [ReqID: {headers.get('REQUEST-ID')}]")
                response = await client.post(url, json=payload, headers=headers)

                if response.status_code in (200, 202):
                    return response.json() if response.content else {"status": "ACCEPTED"}, False
                elif response.status_code == 401:
                    raise ABDMAuthenticationError(f"Gateway rejected auth token: {response.text}")
                else:
                    raise ABDMException(
                        f"Gateway returned status {response.status_code}",
                        code=f"HTTP_{response.status_code}",
                        details={"response": response.text}
                    )
        except httpx.TimeoutException:
            raise ABDMTimeoutError(f"Gateway request to {endpoint} timed out.")
        except Exception as ex:
            if isinstance(ex, ABDMException):
                raise
            raise ABDMException(f"Network error contacting ABDM Gateway: {str(ex)}")


abdm_client = ABDMClient()

"""
ABDM Integration Configuration
Supports Sandbox (NHA Gateway v0.5) and Production environments.
Keeps all credentials securely on the server.
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional


class ABDMSettings(BaseSettings):
    ABDM_ENVIRONMENT: str = "SANDBOX"  # SANDBOX or PRODUCTION
    ABDM_BASE_URL: str = "https://dev.abdm.gov.in/gateway"
    ABDM_CLIENT_ID: str = "SBX_MEDISYNC_DEMO_CLIENT_ID"
    ABDM_CLIENT_SECRET: str = "SBX_MEDISYNC_DEMO_SECRET_KEY"
    ABDM_HIP_ID: str = "MEDISYNC_HOSPITAL_HIP_01"
    ABDM_HIU_ID: str = "MEDISYNC_HOSPITAL_HIU_01"
    ABDM_CALLBACK_URL: str = "http://localhost:8000/api/v0.5/callbacks"
    ABDM_REQUEST_TIMEOUT_SECONDS: int = 20
    ABDM_MOCK_FALLBACK_ENABLED: bool = True  # Allows safe sandbox demonstration when upstream NHA credentials are not yet verified

    model_config = {
        "env_file": ".env",
        "extra": "allow"
    }


abdm_settings = ABDMSettings()

"""
ABDM Service Domain Exceptions
Normalizes upstream NHA / Gateway errors into safe, structured application exceptions.
"""

from typing import Optional, Dict, Any


class ABDMException(Exception):
    """Base exception for all ABDM operations"""
    def __init__(self, message: str, code: str = "ABDM_GENERIC_ERROR", details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.details = details or {}


class ABDMAuthenticationError(ABDMException):
    """Raised when session creation or token validation fails"""
    def __init__(self, message: str = "Failed to authenticate with ABDM Gateway", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="ABDM_AUTH_FAILED", details=details)


class ABDMValidationError(ABDMException):
    """Raised when input parameters (e.g. ABHA number, OTP) fail schema validation"""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="ABDM_VALIDATION_ERROR", details=details)


class ABDMTimeoutError(ABDMException):
    """Raised when an ABDM upstream request or async callback times out"""
    def __init__(self, message: str = "ABDM Gateway did not respond within timeout window", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="ABDM_GATEWAY_TIMEOUT", details=details)


class ABDMCallbackMismatchError(ABDMException):
    """Raised when an incoming callback cannot be matched with an active correlation ID"""
    def __init__(self, message: str = "Callback correlation ID mismatch or expired", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="ABDM_CALLBACK_MISMATCH", details=details)


class ABDMNotConfiguredError(ABDMException):
    """Raised when an official API call is invoked without valid credentials"""
    def __init__(self, message: str = "Official ABDM integration credentials not configured", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="ABDM_NOT_CONFIGURED", details=details)

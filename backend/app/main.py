"""
MediSync Backend Application Entry Point
FastAPI Microservice for ABDM Gateway Integration and AI Clinical Services
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.abdm_router import router as abdm_router, callback_router
from .api.ai_router import router as ai_router
from .services.abdm.config import abdm_settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("medisync")

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("==================================================")
    logger.info("MediSync ABDM Microservice Starting Up...")
    logger.info(f"Target ABDM Environment: {abdm_settings.ABDM_ENVIRONMENT}")
    logger.info(f"Gateway Base URL: {abdm_settings.ABDM_BASE_URL}")
    logger.info(f"Hospital HIP ID: {abdm_settings.ABDM_HIP_ID}")
    logger.info(f"Hospital HIU ID: {abdm_settings.ABDM_HIU_ID}")
    logger.info("==================================================")
    yield

app = FastAPI(
    title="MediSync ABDM Healthcare Integration Service",
    description="Official Ayushman Bharat Digital Mission (ABDM) M1, M2, and M3 Integration API with AI Clinical Synthesis",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# CORS configuration for Frontend and Sandbox callbacks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(abdm_router)
app.include_router(callback_router)
app.include_router(ai_router)


@app.get("/api/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "MediSync ABDM Microservice",
        "environment": abdm_settings.ABDM_ENVIRONMENT,
        "gateway_url": abdm_settings.ABDM_BASE_URL,
        "mock_fallback": abdm_settings.ABDM_MOCK_FALLBACK_ENABLED,
        "version": "2.0.0"
    }

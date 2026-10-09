"""
FastAPI Router for AI-Assisted Medical Summaries
"""

from fastapi import APIRouter, HTTPException
from ..services.ai.summarizer import (
    clinical_summarizer,
    AISummaryRequest,
    AISummaryResponse
)

router = APIRouter(prefix="/api/ai", tags=["AI Clinical Assistant"])


@router.post("/summarize", response_model=AISummaryResponse)
async def summarize_patient_history(req: AISummaryRequest):
    try:
        return await clinical_summarizer.generate_patient_summary(req)
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Failed to generate clinical summary: {str(ex)}")

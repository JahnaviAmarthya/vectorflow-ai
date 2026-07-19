from fastapi import APIRouter
from app.models.schemas import PipelineRequest, PipelineResponse
from app.services.graph_service import analyze_pipeline

router = APIRouter(prefix="/pipelines", tags=["pipelines"])


@router.post("/parse", response_model=PipelineResponse)
def parse_pipeline(payload: PipelineRequest) -> PipelineResponse:
    """Validate a submitted pipeline graph and report DAG status."""
    return analyze_pipeline(payload)

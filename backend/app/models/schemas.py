"""Pydantic schemas for the pipeline parsing API."""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PipelineNode(BaseModel):
    id: str
    type: Optional[str] = None
    position: Optional[Dict[str, float]] = None
    data: Optional[Dict[str, Any]] = None


class PipelineEdge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class PipelineRequest(BaseModel):
    nodes: List[PipelineNode] = Field(default_factory=list)
    edges: List[PipelineEdge] = Field(default_factory=list)


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
    # Extra diagnostics beyond the minimum spec — useful for the UI's
    # validation panel without breaking the required response shape.
    cycle_nodes: Optional[List[str]] = None
    isolated_nodes: Optional[List[str]] = None

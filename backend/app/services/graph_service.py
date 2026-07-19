"""Graph analysis for submitted pipelines, backed by NetworkX."""
import networkx as nx
from app.models.schemas import PipelineRequest, PipelineResponse


def analyze_pipeline(payload: PipelineRequest) -> PipelineResponse:
    graph = nx.DiGraph()

    for node in payload.nodes:
        graph.add_node(node.id)

    for edge in payload.edges:
        # Edges that reference a node not present in the payload are
        # still added so isolated/dangling references surface in the
        # DAG check rather than being silently dropped.
        graph.add_edge(edge.source, edge.target)

    is_dag = nx.is_directed_acyclic_graph(graph)

    cycle_nodes = None
    if not is_dag:
        try:
            cycle = nx.find_cycle(graph)
            cycle_nodes = sorted({n for edge in cycle for n in edge[:2]})
        except nx.NetworkXNoCycle:
            cycle_nodes = []

    isolated_nodes = [n for n in graph.nodes if graph.degree(n) == 0]

    return PipelineResponse(
        num_nodes=len(payload.nodes),
        num_edges=len(payload.edges),
        is_dag=is_dag,
        cycle_nodes=cycle_nodes,
        isolated_nodes=isolated_nodes or None,
    )

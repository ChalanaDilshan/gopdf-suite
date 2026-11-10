# Project Instructions

## graphify Knowledge Graph Integration

Always use the **graphify** skill for understanding codebase structure, architecture, dependencies, and code navigation.

### Guidelines:
1. **Always-On Graph Check**: Whenever starting work or answering questions about this project, check if `graphify-out/graph.json` exists.
   - If `graphify-out/graph.json` exists: Always use `graphify query "<question>"` (or `graphify path`, `graphify explain`) before performing manual greps or reading large sets of raw files.
   - If `graphify-out/graph.json` does not exist: Recommend or run `graphify .` (or invoke the `/graphify` skill) to build a navigable knowledge graph with community structure and dependency links.
2. **Targeted Subgraph Queries**:
   - Trace connections / relationships: `graphify path "<NodeA>" "<NodeB>"`
   - Explain specific components: `graphify explain "<ConceptOrNode>"`
   - Natural language search: `graphify query "<question>"`
   - Architecture review: Check `graphify-out/GRAPH_REPORT.md` or `graphify-out/wiki/index.md` if present.
3. **Keep Graph Updated**: After modifying, refactoring, or creating code files, run `graphify update .` to keep the graph and community clusters synchronized.


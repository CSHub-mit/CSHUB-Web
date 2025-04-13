# import sys
# sys.setrecursionlimit(50000)

# def dfs(Adj, s, parent = None, order = None):
#     if parent is None:
#         parent = [None for v in Adj]
#         order = []
#         parent[s] = s
#     for v in Adj[s]:
#         if parent[v] is None:
#             parent[v] = s
#             dfs(Adj, v, parent, order)
#     order.append(s)
#     return parent, order

# def full_dfs(Adj):
#     parent = [None for v in Adj]
#     order = []
#     for v in range(len(Adj)):
#         if parent[v] is None:
#             parent[v] = v
#             dfs(Adj, v, parent, order)
#     return parent, order

# def find_meeting_point(Adj):
#     '''
#     Find a meeting point in a directed graph using Kosaraju's algorithm
#     '''
#     n = len(Adj)
    
#     # first DFS pass to get finishing order
#     _, order = full_dfs(Adj)
    
#     # Reverse the graph
#     rev_Adj = [[] for _ in range(n)]
#     for u in range(n):
#         for v in Adj[u]:
#             rev_Adj[v].append(u)
    
#     visited = [False] * n
#     scc_id = [0] * n
#     current_id = 0
    
#     for u in reversed(order):
#         if not visited[u]:
#             stack = [u]
#             visited[u] = True
#             while stack:
#                 node = stack.pop()
#                 scc_id[node] = current_id
#                 for v in rev_Adj[node]:
#                     if not visited[v]:
#                         visited[v] = True
#                         stack.append(v)
#             current_id += 1
    
#     if current_id == 0:
#         return None  # empty graph
    
#     has_outgoing = [False] * current_id
    
#     for u in range(n):
#         for v in Adj[u]:
#             if scc_id[u] != scc_id[v]:
#                 has_outgoing[scc_id[u]] = True
    
#     sink_sccs = [i for i in range(current_id) if not has_outgoing[i]]
    
#     if len(sink_sccs) == 1:
#         for u in range(n):
#             if scc_id[u] == sink_sccs[0]:
#                 return u
    
#     return None


def find_start_times(constraints):
    from collections import defaultdict

    # Extract all variable names
    variables = set()
    for a, b, _ in constraints:
        variables.add(a)
        variables.add(b)

    # Assign an index to each variable
    var_list = list(variables)
    var_index = {var: i for i, var in enumerate(var_list)}
    n = len(var_list)

    # Create edge list
    edges = []
    for a, b, t in constraints:
        u = var_index[b]
        v = var_index[a]
        edges.append((u, v, t))

    source = n
    distances = [float('inf')] * (n + 1)
    distances[source] = 0
    for i in range(n):
        edges.append((source, i, 0))  # 0-weight edge from source to every node

    # Run Bellman-Ford
    for _ in range(n):
        updated = False
        for u, v, weight in edges:
            if distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight
                updated = True
        if not updated:
            break
    else:
        for u, v, weight in edges:
            if distances[u] + weight < distances[v]:
                return None  # Negative cycle found

    # Map results back to variable names
    result = {}
    for var, idx in var_index.items():
        result[var] = distances[idx]
    return result

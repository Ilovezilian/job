package algorithm.hungarian;

import java.util.Arrays;

public class HungarianAlgorithmSimple {
    private boolean[] visited;
    private int[] match;
    // graph 是一个二部图的表示，其中 graph[i][j] 是一个布尔值，表示顶点 i 是否连接到顶点 j
    private boolean[][] graph;

    public HungarianAlgorithmSimple(boolean[][] graph) {
        this.graph = graph;
        this.match = new int[graph.length];
        this.visited = new boolean[graph.length];
    }

    /**
     * findMatch 方法用于尝试为未匹配的顶点找到配偶
     * @param vertex
     * @return
     */
    public boolean findMatch(int vertex) {
        for (int i = 0; i < graph.length; i++) {
            if (graph[vertex][i] && !visited[i]) {
                visited[i] = true;
                if (match[i] == -1 || findMatch(match[i])) {
                    match[i] = vertex;
//                    match[vertex] = i;
                    System.out.println(vertex + "," + i);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * solve 方法则是递归调用 findMatch 来找到所有顶点的匹配对。
     * @return
     */
    public int[] solve() {
        int count = 0;
        Arrays.fill(match, -1);
        for (int i = 0; i < graph.length; i++) {
            Arrays.fill(visited, false);
            if (findMatch(i)) {
                count++;
            }
        }
        return match;
    }


}

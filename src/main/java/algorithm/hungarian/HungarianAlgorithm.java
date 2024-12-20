package algorithm.hungarian;

import java.util.Arrays;

public class HungarianAlgorithm {

    private int n; // 顶点的数量
    private int[][] graph; // 权重矩阵
    private int[] lx, ly; // 可行顶标
    private int[] matchX, matchY; // 匹配
    private boolean[] S, T; // 辅助数组，用于寻找增广路径
    private int[] slack, prev; // 松弛值和前驱顶点

    public HungarianAlgorithm(int[][] graph) {
        this.n = graph.length;
        this.graph = graph;
        this.lx = new int[n];
        this.ly = new int[n];
        this.matchX = new int[n];
        this.matchY = new int[n];
        Arrays.fill(matchX, -1);
        Arrays.fill(matchY, -1);
    }

    // 初始化可行顶标
    private void initLabels() {
        Arrays.fill(lx, Integer.MIN_VALUE);
        Arrays.fill(ly, 0);
        for (int u = 0; u < n; u++) {
            for (int v = 0; v < n; v++) {
                if (graph[u][v] > 0) {
                    lx[u] = Math.max(lx[u], graph[u][v]);
                }
            }
        }
    }

    // 寻找增广路径，并返回匹配中边权值和的增量
    private int findAugmentingPath() {
        Arrays.fill(S, false);
        Arrays.fill(T, false);
        Arrays.fill(slack, Integer.MAX_VALUE);
        Arrays.fill(prev, -1);

        int root = -1;
        for (int u = 0; u < n; u++) {
            if (matchX[u] == -1) {
                root = u;
                break;
            }
        }

        S[root] = true;
        for (int u = 0; u < n; u++) {
            if (S[u]) {
                for (int v = 0; v < n; v++) {
                    if (graph[u][v] > 0) {
                        final int tempSlack = lx[u] + ly[v] - graph[u][v];
                        if (!T[v]) {
                            slack[v] = Math.min(slack[v], tempSlack);
                        } else if (prev[v] == -1) {
                            int delta = slack[v];
                            for (int x = 0; x < n; x++) {
                                if (S[x]) lx[x] -= delta;
                                if (T[x]) ly[x] += delta;
                                else slack[x] -= delta;
                            }
                            for (int v0 = 0; v0 < n; v0++) {
                                if (T[v0]) prev[v0] = matchY[v0];
                                else slack[v0] = Math.max(slack[v0], 0);
                            }
                        }
                    }
                }
            }
        }

        int v = 0;
        while (true) {
            int u = prev[v];
            if (u == -1) break;
            matchY[v] = u;
            matchX[u] = v;
            v = matchX[matchY[prev[v]]];
            T[v] = true;
        }

        do {
            int delta = Integer.MAX_VALUE;
            for (int v0 = 0; v0 < n; v0++) {
                if (!T[v0]) delta = Math.min(delta, slack[v0]);
            }
            for (int u = 0; u < n; u++) {
                if (S[u]) lx[u] -= delta;
                if (T[u]) ly[u] += delta;
            }
        } while (prev[root] == -1);

        return lx[root] + ly[matchX[root]] - graph[root][matchX[root]];
    }

    // 求解最大权匹配
    public int solve() {
        initLabels();
        S = new boolean[n];
        T = new boolean[n];
        slack = new int[n];
        prev = new int[n];

        int matchingWeight = 0;
        while (true) {
            int augment = findAugmentingPath();
            if (augment == 0) break;
            matchingWeight += augment;
        }

        return matchingWeight;
    }


}

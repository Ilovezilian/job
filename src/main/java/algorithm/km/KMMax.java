package algorithm.km;

import java.util.Arrays;

/**
 * KM算法用来解决最大权匹配问题： 在一个二分图内，左顶点为X，右顶点为Y，现对于每组左右连接XiYj有权wij，求一种匹配使得所有wij的和最大。也就是最大权匹配一定是完备匹配。如果两边的点数相等则是完美匹配。如果点数不相等，其实可以虚拟一些点，使得点数相等，也成为了完美匹配。最大权匹配还可以用最大流去解决
 * <p>
 * Kuhn－Munkras算法流程：
 * 　　(1)初始化可行顶标的值
 * 　　(2)用匈牙利算法寻找完备匹配
 * 　　(3)若未找到完备匹配则修改可行顶标的值
 * 　　(4)重复(2)(3)直到找到相等子图的完备匹配为止
 */
public class KMMax {
    int[][] w;  // 边权
    int[] la; // 左部点顶标
    int[] lb;  // 右部点顶标
    boolean[] va; // 左部点是否在交错树中
    boolean[] vb; // 右部点是否在交错树中
    int[] match;      // 右部点的匹配点
    int n, delta;

    private KMMax(){}
    public KMMax(int n) {
        this.n = n;
        this.w = new int[n][n]; // 边权
        this.la = new int[n]; // 左部点顶标
        this.lb = new int[n];  // 右部点顶标
        this.va = new boolean[n]; // 左部点是否在交错树中
        this.vb = new boolean[n]; // 右部点是否在交错树中
        this.match = new int[n];      // 右部点的匹配点
    }

    boolean dfs(int u) {
        va[u] = true; // 在交替树中
        for (int v = 0; v < n; v++) {
            System.out.println(" v = " + v + " u = " + u);
            System.out.println("vb = " + Arrays.toString(vb));
            if (!vb[v]) {
                if (la[u] + lb[v] - w[u][v] == 0) {
                    vb[v] = true; // 进入交替树
                    if (-1 == match[v] || dfs(match[v])) {
                        match[v] = u;
                        System.out.println("match = " + Arrays.toString(match));
//                        System.out.println(" v = " + v +" u = " + u);
                        return true; // 找到增广路
                    }
                } else { // 维护delta，同时避免非匹配边右部点进入交替树，保证非匹配边只有左部点顶标减小
                    delta = Math.min(delta, la[u] + lb[v] - w[u][v]);
                }
            }
        }
        return false;
    }

    int km() {
        Arrays.fill(match, -1);
        Arrays.fill(lb, 0);
        for (int i = 0; i < n; i++) {
            la[i] = w[i][0];
            for (int j = 1; j < n; j++)
                la[i] = Math.max(la[i], w[i][j]);
        }
        for (int i = 0; i < n; i++) {
            while (true) // 直到找到匹配
            {
                Arrays.fill(va, false);
                Arrays.fill(vb, false);
                delta = Integer.MAX_VALUE; // maxinf
//                delta = Integer.MIN_VALUE; // mininf
                System.out.println("=========================");
                System.out.println("i = " + i);
                System.out.println("delta = " + delta);
                if (dfs(i))
                    break;
                System.out.println("i = " + i);
                System.out.println("delta = " + delta);
                System.out.println("=========================");
                for (int j = 0; j < n; j++) // 修改顶标，扩充相等子图
                {
                    if (va[j])
                        la[j] -= delta;
                    if (vb[j])
                        lb[j] += delta;
                }
            }
        }

        int ans = 0;
        System.out.println("final match = " + Arrays.toString(match));
        for (int i = 0; i < n; i++) {
            int value = w[match[i]][i];
            ans += value;
            System.out.println("(" + match[i] + "," + i + ")=" + value);
        }
        return ans;
    }

}
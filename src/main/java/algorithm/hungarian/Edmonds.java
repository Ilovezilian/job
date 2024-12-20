package algorithm.hungarian;

import java.util.Arrays;

public class Edmonds {

    static int A[][] = {{0, 1}, {1, 2}, {0, 1}, {2}};

    static int p[] = {-1, -1, -1, -1};

    public static void main(String[] args) {
        for (int i = 0; i < A.length; i++) {
            boolean find = false;
            for (int j : A[i]) {
                if (p[j] == -1) {
                    find = true;
                    p[j] = i;
                    break;
                }
            }

            if (!find) {
                for (int j : A[i]) {
                    if (reset(p[j], j, new int[0])) {
                        p[j] = i;
                        break;
                    }
                }

            }
        }
        System.out.println(Arrays.toString(p));
    }

    /**
     * 第i人将第m位置空 增加最多移动次数限制
     *
     * @param i
     * @param p
     * @return
     */
    static boolean reset(int i, int m, int[] pass) {
        for (int n : A[i]) {
            if (n != m && p[n] == -1) {
                p[n] = i;
                p[m] = -1;
                return true;
            }
        }

        for (int n : A[i]) {
            if (n != m && p[n] != -1) {
                for (int pa : pass)
                    if (p[n] == pa)
                        return false;

                System.out.println(" (i,m):" + i + "," + m + "  n:" + n + "  p[n]:" + p[n]);
                int newpass[] = new int[pass.length + 1];
                System.arraycopy(pass, 0, newpass, 0, pass.length);
                newpass[pass.length] = p[n];
                if (reset(p[n], n, newpass)) {
                    p[n] = i;
                    p[m] = -1;
                    return true;
                }
            }
        }

        return false;
    }

}
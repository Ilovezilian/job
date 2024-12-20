package algorithm.km;

import org.testng.annotations.Test;

public class KMTest {

    @Test
    public void testKM() {
        int[][] a = {
//                {1, 1, 1, 1},
//                {1, 1, 1, 1},
//                {1, 1, 1, 1},
//                {1, 1, 1, 1},

                {9, 6, 4, 7, 1, 2, 3},
                {8, 7, 5, 3, 1, 4, 6},
                {1, 2, 1, 1, 4, 7, 8},

//                {9, 6, 4, 7},
//                {8, 7, 5, 3},
//                {1, 2, 1, 1},
//                {1, 2, 3, 1},
//                {3, 2, 3, 4},
//                {3, 2, 3, 4}
        };
        int n = Math.max(a.length, a[0].length);
//        KMMax km = new KMMax(n);
        KMMin km = new KMMin(n);
        km.n = n;

        for (int i = 0; i < a.length; i++) {
            for (int j = 0; j < a[i].length; j++) {
                km.w[i][j] = a[i][j];
                System.out.println("(" + i + "," + j + ")=" + a[i][j]);
            }
        }

        System.out.println("km.km() = " + km.km());

    }
}
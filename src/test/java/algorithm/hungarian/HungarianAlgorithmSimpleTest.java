package algorithm.hungarian;

import org.testng.annotations.Test;

public class HungarianAlgorithmSimpleTest {

    @Test
    public void testSolve() {
        boolean[][] graph = {
                {false, true, true, false},
                {true, false, true, true},
                {true, true, false, true},
                {false, true, true, false}
        };

        HungarianAlgorithmSimple algorithm = new HungarianAlgorithmSimple(graph);
        int[] match = algorithm.solve();

        System.out.println("Maximum Match: " + match.length);
        for (int i = 0; i < match.length; i++) {
            System.out.println("Vertex " + i + " is matched with " + match[i]);
        }
    }
}
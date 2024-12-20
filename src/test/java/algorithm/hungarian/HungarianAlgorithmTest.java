package algorithm.hungarian;


import org.junit.Test;

public class HungarianAlgorithmTest {

    @Test
    public void testSolve() {
        int[][] graph = {
                {0, 9, 7, 0, 0},
                {6, 0, 0, 8, 5},
                {7, 0, 9, 0, 0},
                {0, 4, 6, 0, 0},
                {0, 0, 0, 3, 8}
        };

        HungarianAlgorithm ha = new HungarianAlgorithm(graph);
        System.out.println("Maximum weight matching: " + ha.solve());

    }
}
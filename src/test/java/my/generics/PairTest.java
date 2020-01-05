package my.generics;

import org.junit.Test;

/**
 * Created by Ilovezilian on 2017/10/14.
 */
public class PairTest {
    @Test
    public void createPair() {
        Pair<Integer, String> p1 = new Pair<>(1, "apple");
        Pair<Integer, String> p2 = new Pair<>(2, "pear");
        boolean same = Util.compare(p1, p2);
        System.out.println(same);
    }

}
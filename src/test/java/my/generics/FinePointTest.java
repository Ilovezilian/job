package my.generics;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

public class FinePointTest {
    @Test
    public void fragmentPrint() {
        List<Integer> l1 = new ArrayList<>();
        List<String> l2 = new ArrayList<>();
        System.out.println(l1.getClass().getName() + " == " + l2.getClass().getName() + " " + (l1.getClass() == l2.getClass()));

    }

}
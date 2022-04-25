package my.collection;

import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class SetTest {
    @Test
    public void toStringTest() {
        Set<String> set = new HashSet<>(Arrays.asList("a","b", "c"));
        System.out.println("set = " + set);

    }
}

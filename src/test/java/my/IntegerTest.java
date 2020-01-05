package my;

import org.junit.Test;

/**
 * Created by Ilovezilian on 2017/8/20.
 */
public class IntegerTest {

    @Test
    public void equalsTest() {
        Object obj1 = new Object();
        Object obj2 = new Object();
        if (obj1.equals(obj2)) {
            System.out.println("equals");
        }
        double a = Double.NaN;
        System.out.println("nan = " + a);

        System.out.println(Integer.valueOf(1).equals(Long.valueOf(1)));
    }
}

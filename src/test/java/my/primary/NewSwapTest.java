package my.primary;

import org.junit.Test;

public class NewSwapTest {

    @Test
    public void intSwapTest() {

        NewSwap temp = new NewSwap();
        final NewSwap newSwap = temp;

        new NewSwap().intSwap();
    }

    @Test
    public void equalsTest() {
        Integer a = 10;
        Double d = 10.0;
        Long l = 10L;
//        int a = 10;
//        double d = 10.0;
//        long l = 10L;
        System.out.println(a.equals(d));
        System.out.println(d.equals(l));
    }

}
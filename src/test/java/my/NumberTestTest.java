package my;

import org.junit.Test;

import java.util.Arrays;

/**
 * Created by Ilovezilian on 2017/6/18.
 */
public class NumberTestTest {

    @Test
    public void decodeInteger() {
        String decode = "0xa";
        Integer a = Integer.decode(decode);
        Integer.valueOf(11);
        Integer.valueOf("11");
        System.out.println("decode about " + decode + " " + a);
        a.toString();
        
    }

    @Test
    public void doubleFloatEquals() {
        Double d1 = Double.valueOf(0.011d);
        Float f1 = Float.valueOf(0.011f);
        System.out.println("double equals " + (d1.equals(0.011d)));
    }


    @Test
    public void compareEquals() {
        /**
         * two variables type must be equals
         */
        Integer integer = Integer.valueOf(11);
        Long longValue = Long.valueOf(11);
        if (integer.equals(longValue)) {
            System.out.println("Long equals Integer");
        } else {
            System.out.println("Long not equals Integer");
        }
        if (0 == integer.compareTo(Math.toIntExact(longValue))) {
            System.out.println("Long equals Integer");
        } else {
            System.out.println("Long not equals Integer");
        }
    }

    @Test
    public void userUnderscore() throws Exception {
        int num = 123;
        System.out.println("num = " + num);
        long num1 = 1_23L;
        System.out.println("num2 = " + num1);
        int num2 = 1_23;
        System.out.println("num3 = " + num2);
    }

    @Test
    public void arrayCopyTest() throws Exception {
        char[] copyFrom = {'a', 'b', 'c', 'd'};
        char[] copyTo = new char[5];
        copyTo[0] = 'e';

        // style 1
        System.arraycopy(copyFrom, 0, copyTo, 1, copyFrom.length);
        System.out.println("copyFrom = " + new String(copyFrom) + " copyTo = " + new String(copyTo));

        // style 2
        copyTo = Arrays.copyOfRange(copyFrom, 0, 6);
        System.out.println("copyFrom = " + new String(copyFrom) + " copyTo = " + new String(copyTo));
    }

    @Test
    public void ArithmeticDemoTest() throws Exception {
        int i = 10;
        int n = i++ % 10;
        System.out.println("i = " + i + " n = " + n);
    }

}
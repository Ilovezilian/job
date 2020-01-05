package my;

import org.junit.Test;

/**
 * Created by Ilovezilian on 2017/8/18.
 */
public class ObjectEquals {
    @Test
    public void twoIntegerEqualsTest() {
        twoIntegerEquals(10);
        System.out.println("------------------------------------------");
        twoIntegerEquals(Integer.MAX_VALUE);
    }

    public void twoIntegerEquals(int var) {
        Integer a = var;
        Integer b = var;
        System.out.println(a == b);
        System.out.println("==******************************************");

//        a = new Integer(var);
//        b = new Integer(var);
        System.out.println(a.equals(b));
        System.out.println("******************************************");

        a = Integer.valueOf(var);
        b = Integer.valueOf(var);
        System.out.println(a == b);
        System.out.println("==******************************************");

        a = Integer.valueOf(var);
        b = Integer.valueOf(var);
        System.out.println(a.equals(b));
        System.out.println("******************************************");

        a = new Integer(var);
        b = new Integer(var);
        System.out.println(a == b);
        System.out.println("==******************************************");

        a = new Integer(var);
        b = new Integer(var);
        System.out.println(a.equals(b));
        System.out.println("******************************************");
        a.toString();
    }
}

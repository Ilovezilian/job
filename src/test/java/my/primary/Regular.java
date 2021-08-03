package my.primary;

import org.junit.Test;

public class Regular {
    @Test
    public void replaceSpecialCharTest() {

        System.out.println("2020".matches("[0-9]*"));
        System.out.println("2020".matches("\\d*"));
        System.out.println("2020-08-22".matches("[208-]*"));
        System.out.println("2020-08-22".matches("[0-9]*"));
        System.out.println("2020-08-22".matches("[0-9-]{10}"));
        System.out.println("2020-08-22".matches("[\\d-]*"));
        System.out.println("2020-08-22".matches("[\\d\\-]*"));
    }
}

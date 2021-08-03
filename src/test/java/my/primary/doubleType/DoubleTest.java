package my.primary.doubleType;

import org.testng.annotations.Test;

public class DoubleTest {
    @Test
    public void DoubleParseTest() {
        System.out.println(Double.parseDouble("0") == 0);
        System.out.println(Double.parseDouble("0"));
        System.out.println(Double.parseDouble("0.00"));
        System.out.println(Double.parseDouble("0.01"));
        System.out.println(Double.parseDouble("2.01"));
        System.out.println(Double.parseDouble("-2.01"));
        System.out.println(Double.parseDouble("2"));
        System.out.println(Double.parseDouble("-2"));
        System.out.println(Double.parseDouble("-2"));

    }
}

package my.datetime;

import org.junit.Test;

import java.time.Year;

public class YearTest {
    @Test
    public void isLeapYearTest() {
        boolean leap = Year.of(2012).isLeap();
        System.out.println("leap = " + leap);
        /**
         * leap = true
         */
    }
}

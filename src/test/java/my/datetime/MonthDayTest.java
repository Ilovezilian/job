package my.datetime;

import org.junit.Test;

import java.time.Month;
import java.time.MonthDay;

public class MonthDayTest {
    @Test
    public void isValidYearTest() {
        MonthDay date = MonthDay.of(Month.FEBRUARY, 29);
        boolean validLeapYear = date.isValidYear(2010);
        System.out.println("validLeapYear = " + validLeapYear);
        /**
         * validLeapYear = false
         */
    }
}

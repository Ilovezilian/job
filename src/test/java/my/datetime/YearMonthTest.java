package my.datetime;

import org.junit.Test;

import java.time.Month;
import java.time.YearMonth;

public class YearMonthTest {
    @Test
    public void lengthOfMonthTest() {
        YearMonth date = YearMonth.now();
        System.out.printf("%s:%d%n", date, date.lengthOfMonth());

        YearMonth date2 = YearMonth.of(2010, Month.FEBRUARY);
        System.out.printf("%s:%d%n", date2, date2.lengthOfMonth());

        YearMonth date3 = YearMonth.of(2012, Month.FEBRUARY);
        System.out.printf("%s:%d%n", date3, date3.lengthOfMonth());
        /**
         * 2021-07:31
         * 2010-02:28
         * 2012-02:29
         */
    }

}

package my.datetime;

import org.junit.Test;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.TemporalAdjusters;

public class LocalDateTest {
    @Test
    public void newInstancesTest() {
        LocalDate date = LocalDate.of(2000, Month.NOVEMBER, 20);
        System.out.println("date = " + date);
        LocalDate nextWed = date.with((TemporalAdjusters.next((DayOfWeek.WEDNESDAY))));
        System.out.println("nextWed = " + nextWed);

        /**
         * date = 2000-11-20
         * nextWed = 2000-11-22
         */
    }
}

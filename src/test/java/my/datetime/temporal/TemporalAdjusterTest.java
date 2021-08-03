package my.datetime.temporal;

import org.testng.annotations.Test;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.TemporalAdjusters;

public class TemporalAdjusterTest {

    @Test
    public void exampleTest() {
        LocalDate date = LocalDate.of(2000, Month.OCTOBER, 15);
        DayOfWeek dotw = date.getDayOfWeek();
        System.out.printf("%s is on a %s%n", date, dotw);
        System.out.printf("first day of Month: %s%n", date.with(TemporalAdjusters.firstDayOfMonth()));
        System.out.printf("first Monday of Month: %s%n", date.with(TemporalAdjusters.firstInMonth(DayOfWeek.MONDAY)));
        System.out.printf("last day of Month: %s%n", date.with(TemporalAdjusters.lastDayOfMonth()));
        System.out.printf("first day of next Month: %s%n", date.with(TemporalAdjusters.firstDayOfNextMonth()));
        System.out.printf("first day of next Year: %s%n", date.with(TemporalAdjusters.firstDayOfNextYear()));
        System.out.printf("first day of Year: %s%n", date.with(TemporalAdjusters.firstDayOfYear()));

        /**
         * 2000-10-15 is on a SUNDAY
         * first day of Month: 2000-10-01
         * first Monday of Month: 2000-10-02
         * last day of Month: 2000-10-31
         * first day of next Month: 2000-11-01
         * first day of next Year: 2001-01-01
         * first day of Year: 2000-01-01
         */
    }

}

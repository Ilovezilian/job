package my.datetime;

import org.testng.annotations.Test;

import java.time.*;
import java.time.temporal.TemporalAdjusters;

public class OffsetDateTimeTest {

    @Test
    public void lastDayTest() {
        // Find the last thursday in July 2013.
        LocalDateTime localDate = LocalDateTime.of(2013, Month.JULY, 20, 19, 30);
        ZoneOffset offset = ZoneOffset.of("-08:00");

        OffsetDateTime offsetDate = OffsetDateTime.of(localDate, offset);
        OffsetDateTime lastThursday = offsetDate.with(TemporalAdjusters.lastInMonth(DayOfWeek.THURSDAY));

        System.out.printf("The last Thursday in July 2013 is the %sth.%n", lastThursday.getDayOfMonth());
        System.out.println(lastThursday);
        /**
         * The last Thursday in July 2013 is the 25th.
         * 2013-07-25T19:30-08:00
         */
    }
}

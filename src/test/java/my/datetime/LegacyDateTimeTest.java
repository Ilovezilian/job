package my.datetime;

import org.testng.annotations.Test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class LegacyDateTimeTest {
    @Test
    public void dateToInstant() {
        Date date = new Date();
        System.out.println("date = " + date);
        Instant instant = date.toInstant();
        System.out.println("instant = " + instant);
        /**
         * date = Fri May 31 18:34:02 CST 2024
         * instant = 2024-05-31T10:34:02.970Z
         */

    }

    @Test
    public void instantToDate() {
        Instant now = Instant.now();
        System.out.println("now = " + now);
        Instant instant = now.truncatedTo(ChronoUnit.DAYS);
        System.out.println("instant = " + instant);
        Date from = Date.from(instant);
        System.out.println("from = " + from);
        /**
         * now = 2024-05-31T10:32:07.146Z
         * instant = 2024-05-31T00:00:00Z
         * from = Fri May 31 08:00:00 CST 2024
         */
    }
}

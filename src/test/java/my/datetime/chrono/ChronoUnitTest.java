package my.datetime.chrono;

import org.junit.Test;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

public class ChronoUnitTest {
    @Test
    public void testBetween() {

        ZonedDateTime dt1 = LocalDateTime.of(2021, 1, 1, 1, 1, 1).atZone(ZoneId.systemDefault());
        ZonedDateTime dt2 = LocalDateTime.of(2022, 2, 2, 2, 2, 2).atZone(ZoneId.systemDefault());

        System.out.println("between = " + ChronoUnit.MILLIS.between(dt1, dt2));
        System.out.println("between = " + ChronoUnit.MILLIS.between(dt1.toInstant(), dt2.toInstant()));
        System.out.println("between = " + ChronoUnit.MILLIS.between(dt1.toLocalDate(), dt2.toLocalTime()));
        /**
         * between = 34304461000
         * between = 34304461000
         * Exception
         */
    }
}

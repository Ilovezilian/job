package my.datetime;

import org.junit.Test;

import java.time.*;

public class DurationTest {
    @Test
    public void testNanoSeconds() {
        // LocalDateTime dateTime1 = LocalDateTime.of(2021, 1, 1, 1, 1, 1);
        // Instant t1 = dateTime1.toInstant(ZoneOffset.UTC);
        // LocalDateTime dateTime2 = LocalDateTime.of(2021, 1, 1, 2, 2, 2);
        // Instant t2 = dateTime2.toInstant(ZoneOffset.UTC);
        LocalDateTime dateTime1 = LocalDateTime.of(2021, 1, 1, 1, 1, 1);
        Instant t1 = dateTime1.atZone(ZoneId.systemDefault()).toInstant();
        LocalDateTime dateTime2 = LocalDateTime.of(2021, 1, 1, 2, 2, 2);
        Instant t2 = dateTime2.atZone(ZoneId.systemDefault()).toInstant();
        Duration duration = Duration.between(t1, t2);
        System.out.println("duration = " + duration);
        /**
         * duration = PT1H1M1S
         */
    }
}

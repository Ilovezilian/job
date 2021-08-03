package my.datetime;

import org.junit.Test;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneId;

public class LocalDateTimeTest {

    @Test
    public void outputTest() {
        System.out.printf("now: %s%n", LocalDateTime.now());
        System.out.printf("Apr 15,1994@11:20am: %s%n", LocalDateTime.of(1994, Month.APRIL, 15, 11, 20));
        System.out.printf("now (from instant): %s%n", LocalDateTime.ofInstant(Instant.now(), ZoneId.systemDefault()));
        System.out.printf("6 months from now: %s%n", LocalDateTime.now().plusMonths(6));
        System.out.printf("6 months ago: %s%n", LocalDateTime.now().minusMonths(6));

        /**
         * now: 2021-07-12T14:24:13.080
         * Apr 15,1994@11:30am: 1994-04-15T11:20
         * now (from instant): 2021-07-12T14:24:13.081
         * 6 months from now: 2022-01-12T14:24:13.082
         * 6 months ago: 2021-01-12T14:24:13.082
         */
    }


}

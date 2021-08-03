package my.datetime;

import org.testng.annotations.Test;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;

public class InstantTest {
    @Test
    public void nowTest() {
        Instant timeStamp = Instant.now();
        System.out.println("timeStamp = " + timeStamp);
        /**
         * timeStamp = 2021-07-14T09:04:19.440Z
         */
    }


    @Test
    public void plusHoursTest() {
        Instant oneHoursLater = Instant.now().plus(1, ChronoUnit.HOURS);
        System.out.println("oneHoursLater = " + oneHoursLater);
        // oneHoursLater = 2021-07-15T03:18:13.548Z
    }

    @Test
    public void untilTest() {
        long secondsFromEpoch = Instant.ofEpochSecond(0L).until(Instant.now(), ChronoUnit.SECONDS);
        System.out.println("secondsFromEpoch = " + secondsFromEpoch);
        // secondsFromEpoch = 1626315791
    }

    @Test
    public void convertInstantToDateTime() {
        Instant timestamp = Instant.now();

        LocalDateTime localDateTime = LocalDateTime.ofInstant(timestamp, ZoneId.systemDefault());
        System.out.printf("%s %d %d at %d:%d%n", localDateTime.getMonth(), localDateTime.getDayOfMonth(), localDateTime.getYear(), localDateTime.getHour(), localDateTime.getMinute());
        System.out.printf("%d-%d-%d at %d:%d%n", localDateTime.getYear(), localDateTime.getMonthValue(), localDateTime.getDayOfMonth(), localDateTime.getHour(), localDateTime.getMinute());
        /**
         * JULY 15 2021 at 10:35
         * 2021-7-15 at 10:35
         */

    }

    @Test
    public void convertDateTimeToInstant() {
        LocalDateTime dateTime1 = LocalDateTime.of(2021, 1, 1, 1, 1, 1);
        Instant t1 = dateTime1.toInstant(ZoneOffset.UTC);
        System.out.println("t1 = " + t1);
        LocalDateTime dateTime2 = LocalDateTime.of(2021, 1, 1, 2, 2, 2);
        Instant t2 = dateTime2.toInstant(ZoneOffset.UTC);
        System.out.println("t2 = " + t2);
        LocalDateTime dateTime3 = LocalDateTime.of(2021, 1, 1, 3, 3, 3);
        Instant t3 = dateTime3.atZone(ZoneId.systemDefault()).toInstant();
        System.out.println("t3 = " + t3);
        LocalDateTime dateTime4 = LocalDateTime.of(2021, 1, 1, 4, 4, 4);
        Instant t4 = dateTime4.atZone(ZoneId.systemDefault()).toInstant();
        System.out.println("t4 = " + t4);
        /**
         * t1 = 2021-01-01T01:01:01Z
         * t2 = 2021-01-01T02:02:02Z
         * t3 = 2020-12-31T19:03:03Z
         * t4 = 2020-12-31T20:04:04Z
         */

    }
}

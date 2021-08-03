package my.datetime;

import org.junit.Test;

import java.time.*;
import java.time.format.DateTimeFormatter;

public class ZonedDateTimeTest {
    @Test
    public void formatterTest() {
        DateTimeFormatter format = DateTimeFormatter.ofPattern("MMM d yyyy hh:mm a");
        //    Leaving from San Francisco on July 20,2013,at 7:30 p.m.
        LocalDateTime leaving = LocalDateTime.of(2013, Month.JULY, 20, 19, 30);
        ZoneId leavingZone = ZoneId.of("America/Los_Angeles");
        ZonedDateTime departure = ZonedDateTime.of(leaving, leavingZone);

        try {
            String out1 = departure.format(format);
            System.out.printf("Leaving: %s(%s)%n", out1, leavingZone);
        } catch (DateTimeException exc) {
            System.out.printf("%s can't be formatted!%n", departure);
            throw exc;
        }

        //    Flight is 10 hours and 50 minutes, or 650 minutes
        ZoneId arrivingZone = ZoneId.of("Asia/Tokyo");
        ZonedDateTime arrival = departure.withZoneSameInstant(arrivingZone).plusMinutes(650);
        try {
            String out2 = arrival.format(format);
            System.out.printf("Arraving:%s(%s)%n", out2, arrivingZone);
        } catch (DateTimeException exc) {
            System.out.printf("%s can't be formatted!%n", departure);
            throw exc;
        }

        if (arrivingZone.getRules().isDaylightSavings(arrival.toInstant())) {
            System.out.printf("(%s daylight saving time will be in effect.)%n", arrivingZone);
        } else {
            System.out.printf("(%s standard time will be in effect.)%n", arrivingZone);
        }

        /**
         * Leaving: 七月 20 2013 07:30 下午(America/Los_Angeles)
         * Arraving:七月 21 2013 10:20 下午(Asia/Tokyo)
         * (Asia/Tokyo standard time will be in effect.)
         */

    }
}

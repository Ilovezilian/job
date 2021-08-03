package my.datetime;

import org.junit.Test;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

public class ZoneIdTest {
    @Test
    public void showTest() {
        Set<String> allZones = ZoneId.getAvailableZoneIds();
        LocalDateTime dt = LocalDateTime.now();

        // Create a List using the set of zones and sort it.
        List<String> zoneList = new ArrayList<>(allZones);
        Collections.sort(zoneList);
        for (String s : zoneList) {
            ZoneId zone = ZoneId.of(s);
            ZonedDateTime zdt = dt.atZone(zone);
            ZoneOffset offset = zdt.getOffset();
            int secondsOfHour = offset.getTotalSeconds() % (60 * 60);
            String out = String.format("%35s %10s%n", zone, offset);
            // Write only time zones that do not have a whole hour offset to standard out.
            if (secondsOfHour != 0) {
                System.out.print(out);
            }
            /**
             *                    America/St_Johns     -02:30
             *                       Asia/Calcutta     +05:30
             *                        Asia/Colombo     +05:30
             *                          Asia/Kabul     +04:30
             *                      Asia/Kathmandu     +05:45
             *                       Asia/Katmandu     +05:45
             *                        Asia/Kolkata     +05:30
             *                        Asia/Rangoon     +06:30
             *                         Asia/Tehran     +04:30
             *                         Asia/Yangon     +06:30
             *                  Australia/Adelaide     +09:30
             *               Australia/Broken_Hill     +09:30
             *                    Australia/Darwin     +09:30
             *                     Australia/Eucla     +08:45
             *                       Australia/LHI     +10:30
             *                 Australia/Lord_Howe     +10:30
             *                     Australia/North     +09:30
             *                     Australia/South     +09:30
             *                Australia/Yancowinna     +09:30
             *                 Canada/Newfoundland     -02:30
             *                        Indian/Cocos     +06:30
             *                                Iran     +04:30
             *                             NZ-CHAT     +12:45
             *                     Pacific/Chatham     +12:45
             *                   Pacific/Marquesas     -09:30
             *
             */
        }
    }
}

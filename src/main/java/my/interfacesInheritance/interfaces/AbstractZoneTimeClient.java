package my.interfacesInheritance.interfaces;

import java.time.ZonedDateTime;

/**
 * Created by Ilovezilian on 2017/7/30.
 */
public interface AbstractZoneTimeClient extends TimeClient {
    ZonedDateTime getZonedDateTime(String zoneString);
}

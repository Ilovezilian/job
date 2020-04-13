package my.collection;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.temporal.TemporalUnit;
import java.util.Date;
import java.util.Map;
import java.util.TreeMap;

import static java.time.temporal.ChronoUnit.DAYS;

public class MyTreeMapUtils {

    public static Map<String, String> generateStringTreeMap() {
        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date today = new Date();
        Map<String, String> map = new TreeMap<>();
        for (int i = 0; i < 10; i++) {
            map.put(sdf.format(today.toInstant().minus(i, DAYS).toEpochMilli()), "");
        }

        return map;
    }
}

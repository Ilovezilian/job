package my.datetime.temporal;

import org.testng.annotations.Test;

import java.time.LocalDate;
import java.time.temporal.ChronoField;

public class TemporalAccessorTest {
    @Test
    public void isSupportedTest() {
        boolean supported = LocalDate.now().isSupported(ChronoField.CLOCK_HOUR_OF_DAY);
        System.out.println(supported);
        supported = LocalDate.now().isSupported(ChronoField.DAY_OF_YEAR);
        System.out.println(supported);
        /**
         false
         true
         */
    }

}

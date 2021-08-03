package my.datetime.temporal;

import org.junit.Test;
import org.springframework.format.datetime.standard.TemporalAccessorPrinter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.IsoFields;

public class TemporalFieldTest {
    @Test
    public void isoFieldTest() {
        LocalDateTime datetime = LocalDateTime.of(2021, 7, 22, 11, 0, 0);
        int second = datetime.get(ChronoField.MILLI_OF_SECOND);
        System.out.println("second = " + second);
        // LocalDate date = datetime.toLocalDate();
        LocalDate date = LocalDate.from(datetime);
        int quarter = date.get(IsoFields.QUARTER_OF_YEAR);
        System.out.println("quarter = " + quarter);
        /**
         second = 0
         quarter = 3
         */

    }
}

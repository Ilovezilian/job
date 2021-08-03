package my.datetime.format;

import org.junit.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeFormatterTest {
    @Test
    public void parseTest() {
        LocalDate date = LocalDate.parse("19590709", DateTimeFormatter.BASIC_ISO_DATE);
        System.out.println("date = " + date);
        /**
         * date = 1959-07-09
         */
    }

    @Test
    public void parse1Test() {
        String in = "三月 01 2019";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd yyyy");
        LocalDate date = LocalDate.parse(in, formatter);
        System.out.println("in = " + in);
        System.out.println("date = " + date);
    }

    @Test
    public void formatterTest() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd yyyy");
        LocalDateTime dateTime = LocalDateTime.now();
        System.out.println("dateTime = " + dateTime.format(formatter));

        formatter = DateTimeFormatter.ofPattern("MMM d yyyy hh:mm a");
        System.out.println("dateTime = " + dateTime.format(formatter));

    }
}

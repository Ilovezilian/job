package my.datetime;

import org.junit.Test;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;

public class MonthTest {
    @Test
    public void maxLengthTest() {
        System.out.printf("%s%n", Month.FEBRUARY.maxLength());
    }

    @Test
    public void getDisplayNameTest() {
        Month month = Month.AUGUST;
        Locale locale = Locale.getDefault();
        System.out.println(month.getDisplayName(TextStyle.FULL, locale));
        System.out.println(month.getDisplayName(TextStyle.NARROW, locale));
        System.out.println(month.getDisplayName(TextStyle.SHORT, locale));
    }
}

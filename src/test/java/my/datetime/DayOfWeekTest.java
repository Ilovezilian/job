package my.datetime;


import org.junit.Test;

import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Locale;

public class DayOfWeekTest {

    public static void main(String[] args) {
        new DayOfWeekTest().plusTest();

        new DayOfWeekTest().getDisplayNameTest();

    }

    @Test
    public void getDisplayNameTest() {
        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
        Locale locale = Locale.getDefault();
        System.out.println(dayOfWeek.getDisplayName(TextStyle.FULL, locale));
        System.out.println(dayOfWeek.getDisplayName(TextStyle.NARROW, locale));
        System.out.println(dayOfWeek.getDisplayName(TextStyle.SHORT, locale));
    }

    @Test
    public void plusTest() {
        System.out.printf("%s%n", DayOfWeek.MONDAY.plus(3));
    }
}
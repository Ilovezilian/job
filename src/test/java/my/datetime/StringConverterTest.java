package my.datetime;

import org.junit.Test;

import java.time.LocalDate;
import java.time.Month;
import java.time.chrono.HijrahChronology;
import java.time.chrono.JapaneseChronology;
import java.time.chrono.MinguoChronology;
import java.time.chrono.ThaiBuddhistChronology;

import static org.junit.Assert.*;

public class StringConverterTest {

    @Test
    public void testToString() {
        LocalDate date = LocalDate.of(1996, Month.OCTOBER, 29);
        System.out.printf("%s%n", StringConverter.toString(date, JapaneseChronology.INSTANCE));
        System.out.printf("%s%n", StringConverter.toString(date, MinguoChronology.INSTANCE));
        System.out.printf("%s%n", StringConverter.toString(date, ThaiBuddhistChronology.INSTANCE));
        System.out.printf("%s%n", StringConverter.toString(date, HijrahChronology.INSTANCE));
        /**
         * 1996-10-29
         * 1996-10-29
         * 1996-10-29
         * 1996-10-29
         */
    }

    @Test
    public void fromString() {
        System.out.printf("%s%n", StringConverter.fromString("10/29/0008 H", JapaneseChronology.INSTANCE));
        System.out.printf("%s%n", StringConverter.fromString("10/29/0085 1", MinguoChronology.INSTANCE));
        System.out.printf("%s%n", StringConverter.fromString("10/29/2539 B.E.", ThaiBuddhistChronology.INSTANCE));
        System.out.printf("%s%n", StringConverter.fromString("6/16/1417 1", HijrahChronology.INSTANCE));
        /**
         * 10/29/0008 H
         * 10/29/0085 1
         * 10/29/2539 B.E.
         * 6/16/1417 1
         */
    }
}
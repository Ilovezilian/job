package my.datetime;

import org.junit.Test;

import java.time.LocalDate;
import java.time.Month;
import java.time.Period;
import java.time.temporal.ChronoUnit;

public class PeriodTest {
    @Test
    public void a() {
        LocalDate today = LocalDate.now();
        LocalDate birthday = LocalDate.of(1960, Month.JANUARY, 1);

        Period p = Period.between(birthday, today);
        long p2 = ChronoUnit.DAYS.between(birthday, today);
        System.out.println("You are " + p.getYears() + " years, " + p.getMonths() + " months, and " + p.getDays() + " days old. (" + p2 + " days total)");
        /**
         * You are 61 years, 7 months, and 2 days old. (22495 days total)
         */
    }

    @Test
    public void testCalculateBirthday() {
        LocalDate birthday = LocalDate.of(1960, Month.JANUARY, 1);

        LocalDate today = LocalDate.of(1994, 1, 29);
        LocalDate nextBDay = birthday.withYear(today.getYear());

        //If your birthday has occurred this year already, add 1 to the year.
        if (nextBDay.isBefore(today) || nextBDay.isEqual(today)) {
            nextBDay = nextBDay.plusYears(1);
        }

        Period p = Period.between(today, nextBDay);
        long p2 = ChronoUnit.DAYS.between(today, nextBDay);
        System.out.println("There are " + p.getMonths() + " months, and " + p.getDays() + " days until your next birthday. (" + p2 + " total)");
        /**
         * There are 11 months, and 3 days until your next birthday. (337 total)
         */
    }
}

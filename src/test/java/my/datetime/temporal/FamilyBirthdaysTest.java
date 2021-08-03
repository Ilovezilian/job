package my.datetime.temporal;

import org.testng.annotations.Test;

import java.time.LocalDate;

import static org.testng.Assert.*;

public class FamilyBirthdaysTest {

    @Test
    public void testIsFamilyBirthday() {
        LocalDate date = LocalDate.now();
        // Invoking the query without using a lambda expression.
        Boolean isFamilyVacation = date.query(new FamilyVacations());

        // Invoking the query using a lambda expression.
        Boolean isFamilyBirthday = date.query(FamilyBirthdays::isFamilyBirthday);

        if (isFamilyVacation || isFamilyBirthday) {

            System.out.printf("%s is an important date!%n", date);
        } else {
            System.out.printf("%s is not an important date.%n", date);
        }

        /**
         * 2021-08-03 is not an important date.
         */
    }

}
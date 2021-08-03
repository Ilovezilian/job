package my.datetime.temporal;

import org.junit.Test;

import java.time.*;
import java.time.temporal.TemporalQueries;
import java.time.temporal.TemporalQuery;
import java.time.temporal.TemporalUnit;

public class TemporalQueriesTest {
    @Test
    public void precisionTest() {
        TemporalQuery<TemporalUnit> query = TemporalQueries.precision();
        System.out.printf("LocalDate precision is %s%n", LocalDate.now().query(query));
        System.out.printf("LocalDateTime precision is %s%n", LocalDateTime.now().query(query));
        System.out.printf("Year Precision is %s%n", Year.now().query(query));
        System.out.printf("YearMonth precision is %s%n", YearMonth.now().query(query));
        System.out.printf("Instant precision is %s%n", Instant.now().query(query));

        /**
         * LocalDate precision is Days
         * LocalDateTime precision is Nanos
         * Year Precision is Years
         * YearMonth precision is Months
         * Instant precision is Nanos
         */
    }
}

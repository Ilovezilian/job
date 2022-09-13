package my.dateUtil;

import org.testng.annotations.Test;

import java.sql.Timestamp;
import java.util.Date;
import java.util.TimeZone;

import static org.testng.Assert.*;

public class AtsDateUtilsTest {

    @Test
    public void testGetMonthsNext() {
    }

    @Test
    public void testGetMonthsAgo() {
    }

    @Test
    public void testStringShortToShortDate() {
    }

    @Test
    public void testDateLongToString() {
    }

    @Test
    public void testStringToLongDate() {
        TimeZone zone = TimeZone.getDefault();
        System.out.println("zone = " + zone);
        TimeZone.setDefault(TimeZone.getTimeZone("GMT+0"));
        Date date = AtsDateUtils.stringShortToShortDate("2022-07-25");
        System.out.println("date = " + date);
        TimeZone.setDefault(TimeZone.getTimeZone("GMT+8"));
        System.out.println("date = " + date);
        date = AtsDateUtils.stringShortToShortDate("2022-07-25");
        System.out.println("date = " + date);
        /**
         * date = Mon Jul 25 00:00:00 GMT+00:00 2022
         * date = Mon Jul 25 08:00:00 GMT+08:00 2022
         * date = Mon Jul 25 00:00:00 GMT+08:00 2022
         */

        TimeZone.setDefault(TimeZone.getTimeZone("GMT+0"));
        date = AtsDateUtils.stringShortToShortDate("2022-07-25");
        java.sql.Date sql = new java.sql.Date(date.getTime());
        System.out.println("sql = " + sql);
        TimeZone.setDefault(TimeZone.getTimeZone("GMT+8"));
        System.out.println("sql = " + sql);
        /**
         * sql = 2022-07-25
         * sql = 2022-07-25
         */
    }

    @Test
    public void testMain() {
        TimeZone zone = TimeZone.getDefault();
        System.out.println("zone = " + zone);
        TimeZone.setDefault(TimeZone.getTimeZone("GMT+0"));
        Date date = AtsDateUtils.stringShortToShortDate("2022-07-25");
        Timestamp timestamp = new Timestamp(date.getTime());
        System.out.println("date = " + timestamp);
        TimeZone.setDefault(TimeZone.getTimeZone("GMT+8"));
        System.out.println("date = " + timestamp);
        date = AtsDateUtils.stringShortToShortDate("2022-07-25");
        timestamp = new Timestamp(date.getTime());
        System.out.println("date = " + timestamp);
        /**
         * date = 2022-07-25 00:00:00.0
         * date = 2022-07-25 08:00:00.0
         * date = 2022-07-25 00:00:00.0
         */
    }
}
package my.dateUtil;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class AtsDateUtils {
    /**
     * function: 得到num个月后的今天
     *
     * @param date
     * @param num
     */
    public static Date getMonthsNext(Date date, int num) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.roll(Calendar.MONTH, num);
        return stringShortToShortDate(dateShortToString(calendar.getTime()));
    }

    /**
     * function: 得到num个月前的今天
     *
     * @param date
     * @param num
     */
    public static Date getMonthsAgo(Date date, int num) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MONTH,  -num);
        return stringShortToShortDate(dateShortToString(calendar.getTime()));
    }

    private static Date stringShortToShortDate(String str) {
        Date date = new Date();

        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            if (null != str && !"".equals(str)) {
                date = sdf.parse(str);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    private static Date stringLongToShortDate(String str) {
        Date date = new Date();

        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            if (null != str && !"".equals(str)) {
                date = sdf.parse(str);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    public static String dateLongToString(Date date) {
        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            return sdf.format(date);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    private static String dateShortToString(Date date) {
        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return sdf.format(date);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }


    public static Date stringToLongDate(String str) {
        Date date = new Date();

        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            if (null != str && !"".equals(str)) {
                date = sdf.parse(str);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    public static void main(String[] args) {
        Date date = stringToLongDate("2021-01-31 12:00:00");
        for (int index = -13; index <= 13; index++) {
            Date next = getMonthsNext(date, index);
            Date pre = getMonthsAgo(date, index);
            System.out.println("  2021-01-01 12:00:00 " + index + " # " + dateLongToString(pre) + " # " + dateLongToString(next));
        }
    }


}

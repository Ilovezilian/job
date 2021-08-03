package my.dateUtil;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateParse {
    public static void main(String[] args) {
        Date date = stringToLongDate("2021-06-21 00:00:00");
        System.out.println("date = " + date);
        Date date1 = stringToLongDate("2021-06-21");
        System.out.println("date = " + date1);
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

}
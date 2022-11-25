package my;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class test1 {
    public static void main(String[] args) {
        // String a = new String("ab"); // a 为一个引用
        // String b = new String("ab"); // b为另一个引用,对象的内容一样
        // String aa = "ab"; // 放在常量池中
        // String bb = "ab"; // 从常量池中查找
        // if (aa == bb) // true
        //     System.out.println("aa==bb");
        // if (a == b) // false，非同一对象
        //     System.out.println("a==b");
        // if (a.equals(b)) // true
        //     System.out.println("aEQb");
        // if (42 == 42.0) { // true
        //     System.out.println("true");
        // }
        // a.notify();
        // a.notifyAll();
        Date date = stringToLongDate("2021-06-21");
        System.out.println("date = " + date);
        while(true) {
            for (int i = 0; i < 100; i++) {
                System.out.println("number " + i + " = " + Integer.numberOfLeadingZeros(16));
            }
        }


    }


    public static Date stringToLongDate(String str) {
        Date date = new Date();

        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            if ("".equals(str)) {
                date = sdf.parse(str);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (true) {
            int a = 1;
            a ++;
        }
        if (true) {
            int b = 1;
            b ++;
        }

        return date;
    }

}
package test;

import java.util.*;

/**
 * @ClassName TestName
 * @Description TODO
 * @Author Administrator
 * @Date 2022-09-19 10:27
 * @Version 1.0
 */
public class TestName {
    private final static String aa = "testName";

    /**
     * @param args
     */
    public static void main(String[] args) throws InterruptedException {
        Date a = new Date();
        Map<Date, Date> map = new HashMap<>();
        TestName testName = new TestName();
        HashMap<String, String> aMap = new HashMap<>();
        final int mod = 4;
        while (true) {
            for (int i = 0; i < 10000; i++) {
                Date b = new Date();
                map.put(b, a);
                if (i % mod == 0) {
                    testName.another(i, new String[]{"first", String.valueOf(i), String.valueOf(b)});
                } else if (i % mod == 2) {
                    testName.another(i, i);
                } else if (i % mod == 3){
                    aMap.put(aa, "third" + i);
                    testName.another(i, aMap);
                } else {
                    DynamicLinking.sayHello();
                }

                Thread.sleep(500);
            }
        }
    }

    public String another(int i, String[] args) {
        return "love u " + args[1];
    }

    public String another(int i, int args) {
        return "love u " + args;
    }

    public String another(int i, Map<String, String> args) {
        return "love u " + args;
    }

    private static String getName(String aaa, String bb) {
        return null;
    }

    @Override
    public boolean equals(Object obj) {
        return super.equals(obj);
    }


}

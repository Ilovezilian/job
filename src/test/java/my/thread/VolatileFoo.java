package my.thread;

import java.util.concurrent.TimeUnit;

public class VolatileFoo {
    final static int MAX = 5;
    /***
     * 发现 volatile 关键词
     */
    static int init_value = 0;
//    static volatile int init_value = 0;

    public static void main(String[] args) {
        new Thread(() -> {
            int local = init_value;
            while (true) {
//            while (local < MAX) {
                if (local != init_value) {
                    System.out.println("the init is update to " + init_value);
                    local = init_value;
                }
            }
        }, "Reader").start();

        new Thread(() -> {
            int local = init_value;
//            while (local < MAX) {
            while (true) {
                System.out.println("init_value will change to " + local++);
                init_value = local;

                try {
                    TimeUnit.SECONDS.sleep(2);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "Writer").start();

        System.out.println("init_value = " + init_value);
    }
}

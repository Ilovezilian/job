package my.concurrency;

import java.util.ArrayList;
import java.util.List;

public class BadThreads {

    static String message;

    private static class CorrectorThread extends Thread {

        public void run() {
            //            try {
            //                sleep(1000);
            //            } catch (InterruptedException e) {
            //            }
            // Key statement 1:
            setMessage("Mares do eat oats.");
        }
    }

    public static void main(String[] args) throws InterruptedException {

        List<String> list = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            list.add(test(i));
        }
        //        System.out.println("list = " + list);
    }

    private static String test(int i) throws InterruptedException {
        final CorrectorThread thread = new CorrectorThread();
        thread.start();
        setMessage("Mares do not eat oats.");
        //        thread.join();
        //        Thread.sleep(2000);
        // Key statement 2:
        System.out.println("no" + i + "\t" + message);
        return "no" + i + "\t" + message;
    }

    private static synchronized void setMessage(String s) {
        message = s;
    }
}
package my.datetime;

import org.junit.Test;

import java.time.LocalTime;

public class LocalTimeTest {
    @Test
    public void displayTest() {
        LocalTime thisSec;
        // for (;;) {
        for (int i = 0; i < 10; i++) {
            thisSec = LocalTime.now();
            display(thisSec.getHour(), thisSec.getMinute(), thisSec.getSecond());
        }
        /**
         * time = 11:04:13
         * time = 11:04:13
         * time = 11:04:13
         * time = 11:04:13
         * time = 11:04:13
         * time = 11:04:13
         * time = 11:04:13
         * time = 11:04:13
         * time = 11:04:13
         * time = 11:04:13
         */
    }

    public void display(int hour, int minute, int second) {
        // System.out.println("time = " + hour + ":" + minute + ":" + second);
        System.out.printf("time = %02d:%02d:%02d%n", hour, minute, second);
    }
}

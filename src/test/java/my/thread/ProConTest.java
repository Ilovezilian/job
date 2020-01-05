package my.thread;

import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class ProConTest {
    //    @Test
//    public void testProCon() {
    public static void main(String[] args) {
        Queue<Integer> queue = new PriorityQueue<>();
        int i1 = 8;
        for (int i = 0; i < i1; i++) {
            new Thread(() -> {
                Producter producter = new Producter(queue);
                Random random = new Random();
                while (true) {
                    Integer productor = random.nextInt();
                    producter.product(productor);
                }
            }, "producter" + i).start();
        }

        for (int i = 0; i < i1; i++) {
            new Thread(() -> {
                Consumer consumer = new Consumer(queue);
                while (true) {
                    consumer.consume();
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }, "consumer" + i).start();
        }

    }
}

package my.thread;

import java.util.Queue;

public class Producter {
    private static final int MAX_SIZE = 20;
    private final Queue<Integer> queue;

    public Producter(Queue<Integer> queue) {
        this.queue = queue;
    }

    public void product(Integer productor) {
        synchronized (queue) {
            while (queue.size() == MAX_SIZE) {
                System.out.println(Thread.currentThread().getName() + "队列满了");
                try {
                    queue.wait(0);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            System.out.println(Thread.currentThread().getName() + "生产 == " + productor);
            queue.add(productor);
            queue.notifyAll();
        }
    }
}

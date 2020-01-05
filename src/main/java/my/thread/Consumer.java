package my.thread;

import java.util.Queue;

public class Consumer {
    private final Queue<Integer> queue;

    public Consumer(Queue<Integer> queue) {
        this.queue = queue;
    }

    public Integer consume() {
        synchronized (queue) {

            while (queue.size() == 0) {
                System.out.println(Thread.currentThread().getName() + "队列满了");
                try {
                    queue.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            Integer poll = queue.poll();
            System.out.println(Thread.currentThread().getName() + "消费了==" + poll);
            queue.notifyAll();
            return poll;
        }
    }
}

package my.thread;

import org.junit.Test;

import java.util.Random;

public class ThreadOrderTest {

    /**
     * 第一种方式
     * 指定线程执行顺序：通过共享对象锁加上可见变量来实现
     *
     * @throws Exception
     */
    @Test
    public void threadOrderTest1() {
        ThreadOrder threadOrder = new ThreadOrder();

        // TODO Auto-generated method stub
        Thread thread1 = new Thread(threadOrder::methodA);

        // TODO Auto-generated method stub
        Thread thread2 = new Thread(threadOrder::methodB);

        // TODO Auto-generated method stub
        Thread thread3 = new Thread(threadOrder::methodC);

        thread1.start();
        thread2.start();
        thread3.start();
    }


    /**
     * 第二种方式
     * 通过主线程join()
     *
     * @throws Exception
     */
    @Test
    public void threadOrderTest2() throws Exception {
        Thread thread1 = new Thread(() -> {
            // TODO Auto-generated method stub
            System.out.println("AAA");
        });

        Thread thread2 = new Thread(() -> {
            // TODO Auto-generated method stub
            System.out.println("BBB");
        });

        Thread thread3 = new Thread(() -> {
            // TODO Auto-generated method stub
            System.out.println("CCC");
        });

        thread1.start();
        thread1.join();
        thread2.start();
        thread2.join();
        thread3.start();
        thread3.join();
    }

    /**
     * 第三种方式
     * 通过线程执行join
     */
    @Test
    public void threadOrderTest3() {
        T1 t1 = new T1();
        T2 t2 = new T2(t1);
        T3 t3 = new T3(t2);
        t2.start();
        t1.start();
        t3.start();
    }

    @Test
    public void testCollections() throws InterruptedException {
        for (int i = 0; i < 20; i++) {
            System.out.print("#### " + i);
            testCollection(i);
            System.out.println();
        }

    }

    //    @Test
    public void testCollection(int i) throws InterruptedException {
        Thread a = new Thread(() -> System.out.print(" " + i + "-a"));
        Thread b = new Thread(() -> System.out.print(" " + i + "-b"));
        a.start();
        a.join();
        b.start();
        b.join();
        System.out.print(" end");
    }


}


class T1 extends Thread {
    public void run() {
        Random random = new Random();
        try {
            Thread.sleep(random.nextInt(1000));
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("in T1");
    }
}

class T2 extends Thread {
    private Thread thread;

    public T2(Thread thread) {
        this.thread = thread;
    }

    public void run() {
        try {
            thread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("in T2");
    }
}

class T3 extends Thread {
    private Thread thread;

    public T3(Thread thread) {
        this.thread = thread;
    }

    public void run() {
        try {
            thread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("in T3");
    }
}

package my.thread;

/**
 * 指定线程执行顺序：通过synchronized共享对象锁加上volatile可见变量来实现
 */
public class ThreadOrder {

    private volatile int orderNum = 1;

    public synchronized void methodA() {
        try {
            while (orderNum != 1) {
                wait();
            }
            for (int i = 0; i < 2; i++) {
                System.out.println("AAAAA");
            }
            orderNum = 2;
            notifyAll();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public synchronized void methodB() {
        try {
            while (orderNum != 2) {
                wait();
            }
            for (int i = 0; i < 2; i++) {
                System.out.println("BBBBB");
            }
            orderNum = 3;
            notifyAll();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public synchronized void methodC() {
        try {
            while (orderNum != 3) {
                wait();
            }
            for (int i = 0; i < 2; i++) {
                System.out.println("CCCCC");
            }
            orderNum = 1;
            notifyAll();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

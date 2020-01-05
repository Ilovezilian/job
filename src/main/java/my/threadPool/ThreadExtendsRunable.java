package my.threadPool;

/**
 * Created by Ilovezilian on 2016/10/21.
 */
public class ThreadExtendsRunable {
    public static void main(String[] args) {
//        ThreadExtendsRunable threadExtendsRunable = new ThreadExtendsRunable();
//        threadExtendsRunable.run();
        for(int i = 0; i < 20; i ++) {
            try {
                Thread.sleep(1000);
            }catch (InterruptedException e){}
            Thread t1 = new Thread(new A());
            t1.start();
            System.out.println("hello1");
//        Thread my.thread = new Thread(threadExtendsRunable);
            Thread t2 = new Thread(new B());
            t2.start();
            System.out.println("hello2");
            System.out.println();
//        my.thread.start();
        }
    }
    public void run(){
        System.out.println("this is run method");
    }
}
class A extends Thread{
    @Override
    public void run() {
        System.out.println("A");
    }
}
class B implements Runnable{
    @Override
    public void run() {
        System.out.println("B");
    }
}

package my.primary.init;

public class ClassInitOrderTest1 {


    public static ClassInitOrderTest1 t1 = new ClassInitOrderTest1(); //静态成员变量

    {
        System.out.println("blockA"); //构造代码块
    }

    static {
        System.out.println("blockB"); //静态代码块
    }

    public static void main(String[] args) {
        ClassInitOrderTest1 t2 = new ClassInitOrderTest1();
        /**
         * blockA
         * blockB
         * blockA
         * 分析：
         * 1.在该代码中，加载类JDtest1时，首先执行的第一行代码，定义静态成员变量 t1，（静态成员是类所有的对象的共享的成员，而不是某个对象的成员。）
         * 2.定义的t1的同时，又new了一个新的对象出来，这个对象是本类对象，new的过程中，首先要执行构造代码块，即输出了“blockA”
         * 3.接着，执行下一行static代码块，输出“blockB”，至此，类加载完成
         * 4.执行main方法，同样，new了一个JDtest1对象，接下来要执行的是构造代码块，输出“blockA”
         */
    }

}


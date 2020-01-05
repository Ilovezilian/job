package my.primary.init;

public class ClassInitOrderTest {
    public static void main(String[] args) {
        new B();
        /**
         * static A
         * static B
         * A
         * initial A
         * B
         * initial B
         * 由上得出：运行过程：类实例化-》代码块初始化-》构造函数
         */
    }

}

class A {
    public A() {
        System.out.println("initial A");
    }

    {
        System.out.println("A");
    }

    static {
        System.out.println("static A");
    }
}


class B extends A {
    public B() {
        System.out.println("initial B");
    }

    {
        System.out.println("B");
    }

    static {
        System.out.println("static B");
    }

}

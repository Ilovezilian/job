package test;

/**
 * @ClassName aaa
 * @Description TODO
 * @Author shuai.pan
 * @Date 2022-12-09 18:38
 * @Version 1.0
 */
public class DynamicLinking {
    static abstract class Human {
        protected abstract void sayHello();
    }

    static class Man extends Human {
        @Override
        protected void sayHello() {
            System.out.println("Man");
        }
    }

    static class Woman extends Human {
        @Override
        protected void sayHello() {
            System.out.println("Woman");
        }
    }

    public static void main(String[] args) {
        sayHello();
    }

    public static void sayHello() {
        Human man = new Man();
        Human woman = new Woman();
        man.sayHello();
        woman.sayHello();
        man = new Woman();
        man.sayHello();
    }
}

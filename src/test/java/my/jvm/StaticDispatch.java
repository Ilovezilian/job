package my.jvm;

/**
 * @ClassName StaticDispatch
 * @Description 方法静态分派演示
 * @Author shuai.pan
 * @Date 2022-12-21 16:44
 * @Version 1.0
 */
public class StaticDispatch {
    public abstract class Parent { }
    public class Son extends Parent { }
    public class Daughter extends Parent { }

    private static abstract class Human { }

    private static class Man extends Human { }

    private static class Woman extends Human { }

    private void sayHello(Parent guy) {
        System.out.println("Hello, Parent!");
    }

    private void sayHello(Son man) {
        System.out.println("Hello, Son!");
    }

    private void sayHello(Daughter woman) {
        System.out.println("Hello, Daughter!");
    }

    private void sayHello(Human guy) {
        System.out.println("Hello, guy!");
    }

    private void sayHello(Man man) {
        System.out.println("Hello, man!");
    }

    private void sayHello(Woman woman) {
        System.out.println("Hello, woman!");
    }

    public static void main(String[] args) {

        Human man = new Man();
        Human woman = new Woman();
        StaticDispatch dispatch = new StaticDispatch();
        dispatch.sayHello(man);
        dispatch.sayHello(woman);
        dispatch.sayHello(new Man());
        dispatch.sayHello(new Woman());

        Parent son = new StaticDispatch().new Son();
        Parent daughter = new StaticDispatch().new Daughter();
        dispatch.sayHello(son);
        dispatch.sayHello(daughter);
        dispatch.sayHello(new StaticDispatch().new Son());
        dispatch.sayHello(new StaticDispatch().new Daughter());
    }
}

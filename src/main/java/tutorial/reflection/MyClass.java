package tutorial.reflection;

public class MyClass {
    static Object o = new Object() {
        public void m() {
        }
    };

    static {
        Class c = o.getClass().getEnclosingClass();
        System.out.println("c = " + c);
    }
}